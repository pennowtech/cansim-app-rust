// src/components/MqttExplorer.tsx
import React, { useState } from "react";

export const MqttExplorer: React.FC = () => {
    const [brokerUrl, setBrokerUrl] = useState("mqtt://localhost:1883");
    const [clientId, setClientId] = useState("cansim-mqtt-client");
    const [topic, setTopic] = useState("#");
    const [messages, setMessages] = useState<string[]>([]);

    // TODO: wire up to real MQTT (Tauri backend or browser client)
    const handleConnect = () => {
        setMessages((prev) => [
            ...prev,
            `Connecting to ${brokerUrl} as ${clientId} (TODO: implement)`,
        ]);
    };

    return (
        <div className="flex flex-col h-full min-h-0 gap-2">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-[11px] flex flex-col gap-2">
                <div className="font-semibold text-xs">MQTT Explorer</div>
                <div className="grid grid-cols-[2fr_2fr_2fr_auto] gap-2 items-end">
                    <div>
                        <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                            Broker URL
                        </label>
                        <input
                            className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1 text-[11px]"
                            value={brokerUrl}
                            onChange={(e) => setBrokerUrl(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                            Client ID
                        </label>
                        <input
                            className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1 text-[11px]"
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                            Topic filter
                        </label>
                        <input
                            className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1 text-[11px]"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleConnect}
                        className="rounded-md border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-[11px] px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        Connect
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-[11px] overflow-auto font-mono">
                {messages.length === 0 ? (
                    <div className="text-slate-500 dark:text-slate-400">
                        No MQTT messages yet. Connect to a broker and subscribe
                        to topics.
                    </div>
                ) : (
                    messages.map((m, i) => <div key={i}>{m}</div>)
                )}
            </div>
        </div>
    );
};
