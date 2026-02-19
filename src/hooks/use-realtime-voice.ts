import { useEffect, useRef, useState, useCallback } from "react";

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
  onToolCall?: (toolName: string) => void;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/* ------------------------------------------------------------------ */
/*  Tool definitions for overlay components                           */
/* ------------------------------------------------------------------ */

const OVERLAY_TOOLS = [
  { name: "show_upload", description: "Show the file upload dropzone" },
  { name: "show_preview", description: "Show the web preview browser" },
  { name: "show_attachments", description: "Show the attachments list" },
  { name: "show_chain_of_thought", description: "Show the chain of thought reasoning view" },
  { name: "show_confirmation", description: "Show the confirmation dialog" },
  { name: "show_plan", description: "Show the plan overview" },
  { name: "show_queue", description: "Show the task queue" },
  { name: "show_env_vars", description: "Show environment variables" },
  { name: "show_file_tree", description: "Show the file tree explorer" },
  { name: "show_sandbox", description: "Show the code sandbox" },
  { name: "show_stack_trace", description: "Show the stack trace viewer" },
  { name: "show_terminal", description: "Show the terminal" },
  { name: "show_test_results", description: "Show test results" },
  { name: "show_workflow", description: "Show the workflow canvas" },
  { name: "show_tweet_card", description: "Show the tweet card" },
  { name: "show_progress_bar", description: "Show the progress bar" },
  { name: "show_calendar", description: "Show the calendar" },
  { name: "show_video", description: "Show the video player" },
  { name: "show_table", description: "Show the data table" },
  { name: "show_color_picker", description: "Show the color picker" },
  { name: "show_qr_code", description: "Show the QR code generator" },
  { name: "show_chart", description: "Show the chart" },
  { name: "show_chatbot", description: "Show the chatbot interface" },
] as const;

const TOOL_DEFINITIONS = OVERLAY_TOOLS.map((t) => ({
  type: "function" as const,
  name: t.name,
  description: t.description,
  parameters: { type: "object" as const, properties: {} },
}));

export function useRealtimeVoice(options: UseRealtimeVoiceOptions = {}) {
  const { autoConnect = false, model, voice, onToolCall } = options;
  const [voiceState, setVoiceState] = useState<VoiceState>("disconnected");
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const connectingRef = useRef(false);
  const mountedRef = useRef(true);
  const onToolCallRef = useRef(onToolCall);

  // Keep callback ref fresh
  useEffect(() => {
    onToolCallRef.current = onToolCall;
  }, [onToolCall]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const sendDcMessage = useCallback((payload: Record<string, unknown>) => {
    const dc = dcRef.current;
    if (dc && dc.readyState === "open") {
      dc.send(JSON.stringify(payload));
    }
  }, []);

  function handleServerEvent(event: any) {
    if (!mountedRef.current) return;
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
      case "response.function_call_arguments.done": {
        const toolName = event.name;
        console.log("Tool call received:", toolName);
        onToolCallRef.current?.(toolName);

        // Acknowledge the tool call so the model continues
        sendDcMessage({
          type: "conversation.item.create",
          item: {
            type: "function_call_output",
            call_id: event.call_id,
            output: JSON.stringify({ success: true }),
          },
        });
        sendDcMessage({ type: "response.create" });
        break;
      }
      case "error":
        console.error("Realtime API error:", event.error);
        break;
      default:
        console.log("Realtime event:", event.type);
    }
  }

  function cleanupConnection() {
    dcRef.current?.close();
    dcRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    if (audioRef.current) {
      audioRef.current.srcObject = null;
      audioRef.current = null;
    }
    connectingRef.current = false;
  }

  function disconnect() {
    cleanupConnection();
    if (mountedRef.current) {
      setVoiceState("disconnected");
    }
  }

  async function connect() {
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

      pc.onconnectionstatechange = () => {
        console.log("WebRTC connection state:", pc.connectionState);
        if (pc.connectionState === "connected" && mountedRef.current) {
          setVoiceState("listening");
        }
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
        console.log("Data channel opened");
        if (mountedRef.current) {
          setVoiceState("listening");
          connectingRef.current = false;

          // Register tools with the session
          sendDcMessage({
            type: "session.update",
            session: {
              tools: TOOL_DEFINITIONS,
            },
          });
          console.log("Registered", TOOL_DEFINITIONS.length, "tools with session");
        }
      };

      dc.onclose = () => {
        console.log("Data channel closed");
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
  }

  // Auto-connect on mount only
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => {
      cleanupConnection();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { voiceState, connect, disconnect };
}
