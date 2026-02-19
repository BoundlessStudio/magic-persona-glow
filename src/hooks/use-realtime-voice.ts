import { useCallback, useEffect, useRef, useState } from "react";

export type VoiceState =
  | "idle"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "disconnected";

interface UseRealtimeVoiceOptions {
  autoConnect?: boolean;
  model?: string;
  voice?: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export function useRealtimeVoice(options: UseRealtimeVoiceOptions = {}) {
  const { autoConnect = false, model, voice } = options;
  const [voiceState, setVoiceState] = useState<VoiceState>("disconnected");
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const connectingRef = useRef(false);

  const disconnect = useCallback(() => {
    dcRef.current?.close();
    dcRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    if (audioRef.current) {
      audioRef.current.srcObject = null;
    }
    setVoiceState("disconnected");
    connectingRef.current = false;
  }, []);

  const connect = useCallback(async () => {
    if (connectingRef.current || pcRef.current) return;
    connectingRef.current = true;
    setVoiceState("connecting");

    try {
      // 1. Get ephemeral key from edge function
      const sessionRes = await fetch(
        `${SUPABASE_URL}/functions/v1/realtime-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
          body: JSON.stringify({ model, voice }),
        }
      );

      if (!sessionRes.ok) {
        throw new Error(`Session creation failed: ${sessionRes.status}`);
      }

      const session = await sessionRes.json();
      const ephemeralKey = session.client_secret?.value;

      if (!ephemeralKey) {
        throw new Error("No ephemeral key received");
      }

      // 2. Create peer connection
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // 3. Set up audio output
      const audio = new Audio();
      audio.autoplay = true;
      audioRef.current = audio;

      pc.ontrack = (e) => {
        audio.srcObject = e.streams[0];
      };

      // 4. Add microphone track
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      pc.addTrack(stream.getTracks()[0], stream);

      // 5. Set up data channel for events
      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      dc.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          handleServerEvent(event);
        } catch {
          // ignore parse errors
        }
      };

      dc.onopen = () => {
        setVoiceState("listening");
        connectingRef.current = false;
      };

      dc.onclose = () => {
        disconnect();
      };

      // 6. Create and set local offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // 7. Send offer to OpenAI and get answer
      const sdpRes = await fetch(
        `https://api.openai.com/v1/realtime?model=${encodeURIComponent(
          model || "gpt-4o-realtime-preview-2024-12-17"
        )}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ephemeralKey}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp,
        }
      );

      if (!sdpRes.ok) {
        throw new Error(`SDP exchange failed: ${sdpRes.status}`);
      }

      const answerSdp = await sdpRes.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });
    } catch (err) {
      console.error("Realtime voice connection error:", err);
      disconnect();
    }
  }, [model, voice, disconnect]);

  const handleServerEvent = useCallback((event: any) => {
    switch (event.type) {
      case "input_audio_buffer.speech_started":
        setVoiceState("listening");
        break;
      case "input_audio_buffer.speech_stopped":
      case "input_audio_buffer.committed":
        setVoiceState("thinking");
        break;
      case "response.audio.delta":
      case "response.audio_transcript.delta":
        setVoiceState("speaking");
        break;
      case "response.audio.done":
      case "response.audio_transcript.done":
      case "response.done":
        setVoiceState("listening");
        break;
      case "error":
        console.error("Realtime API error:", event.error);
        break;
    }
  }, []);

  // Auto-connect
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return { voiceState, connect, disconnect };
}
