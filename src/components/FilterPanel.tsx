// src/components/FilterPanel.tsx
import React, { useEffect, useMemo, useState } from "react";
import { FilterCriteria } from "../types";

interface Props {
    criteria: FilterCriteria;
    onApply: (c: FilterCriteria) => void;
    onClear: () => void;

    // NEW: allow table to "set current cell as filter"
    onSetField?: (field: keyof FilterCriteria, value: string) => void;
}

const nowIsoLocal = () => {
    const d = new Date();
    const pad = (n: number, w = 2) => String(n).padStart(w, "0");
    // yyyy-MM-ddTHH:mm (input[type=datetime-local] wants this)
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const FilterPanel: React.FC<Props> = ({
    criteria,
    onApply,
    onClear,
    onSetField,
}) => {
    const [local, setLocal] = useState<FilterCriteria>(criteria);

    // IMPORTANT: keep local state in sync if parent changes criteria (e.g., context-menu sets a field)
    useEffect(() => setLocal(criteria), [criteria]);

    const handleChange = (field: keyof FilterCriteria, value: any) => {
        setLocal((prev) => ({ ...prev, [field]: value }));
        onSetField?.(field, String(value ?? ""));
    };

    const apply = () => onApply(local);

    const input =
        "w-full rounded-md bg-white dark:bg-slate-900 border border-slate-300 px-2 py-1 text-[12px] text-slate-800 " +
        "hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800";

    const select =
        "w-full rounded-md bg-white dark:bg-slate-900 border border-slate-300 px-2 py-1 text-[12px] text-slate-800 " +
        "hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800";

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-300 rounded-xl p-3 flex flex-col h-full text-[12px] text-slate-800 shadow-sm dark:border-slate-700 dark:text-slate-100">
            <h2 className="text-xs font-semibold mb-2 text-slate-700 dark:text-slate-100">
                Filter
            </h2>

            <div className="space-y-2 overflow-auto pr-1">
                <Field label="Service name">
                    <input
                        className={input}
                        value={local.service_name ?? ""}
                        onChange={(e) =>
                            handleChange("service_name", e.target.value)
                        }
                    />
                </Field>

                <Field label="Service ID">
                    <input
                        className={input}
                        value={local.service_id ?? ""}
                        onChange={(e) =>
                            handleChange("service_id", e.target.value)
                        }
                    />
                </Field>

                <Field label="SRC">
                    <input
                        className={input}
                        value={local.src ?? ""}
                        onChange={(e) => handleChange("src", e.target.value)}
                    />
                </Field>

                <Field label="DST">
                    <input
                        className={input}
                        value={local.dst ?? ""}
                        onChange={(e) => handleChange("dst", e.target.value)}
                    />
                </Field>

                <Field label="Direction">
                    <select
                        className={select}
                        value={local.direction ?? "Any"}
                        onChange={(e) =>
                            handleChange("direction", e.target.value)
                        }
                    >
                        <option value="Any">Any</option>
                        <option value="RX">RX</option>
                        <option value="TX">TX</option>
                    </select>
                </Field>

                <Field label="Cmd class">
                    <input
                        className={input}
                        value={local.cmd_class ?? ""}
                        onChange={(e) =>
                            handleChange("cmd_class", e.target.value)
                        }
                    />
                </Field>

                <Field label="Attribute">
                    <input
                        className={input}
                        value={local.attribute ?? ""}
                        onChange={(e) =>
                            handleChange("attribute", e.target.value)
                        }
                    />
                </Field>

                <Field label="Feature">
                    <input
                        className={input}
                        value={local.feature ?? ""}
                        onChange={(e) =>
                            handleChange("feature", e.target.value)
                        }
                    />
                </Field>

                <Field label="Payload">
                    <input
                        className={input}
                        value={local.payload ?? ""}
                        onChange={(e) =>
                            handleChange("payload", e.target.value)
                        }
                    />
                </Field>

                <Field label="Message severity">
                    <select
                        className={select}
                        value={local.severity_mode ?? "any"}
                        onChange={(e) =>
                            handleChange("severity_mode", e.target.value)
                        }
                    >
                        <option value="any">Any</option>
                        <option value="error">Error only</option>
                        <option value="warn">Warn only</option>
                        <option value="clean">
                            Clean only (no error/warn)
                        </option>
                        <option value="non_clean">
                            Non-clean (Error or Warn)
                        </option>
                    </select>
                </Field>

                <Field label="Error">
                    <input
                        className={input}
                        value={local.error ?? ""}
                        onChange={(e) => handleChange("error", e.target.value)}
                    />
                </Field>

                <Field label="Text search">
                    <input
                        className={input}
                        value={local.text_search ?? ""}
                        onChange={(e) =>
                            handleChange("text_search", e.target.value)
                        }
                    />
                </Field>

                <div className="pt-1 border-t border-slate-200 dark:border-slate-800" />

                <Field label="Time from">
                    <div className="flex gap-2 items-center">
                        <label className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                            <input
                                type="checkbox"
                                checked={!!local.time_from_enable}
                                onChange={(e) =>
                                    handleChange(
                                        "time_from_enable",
                                        e.target.checked,
                                    )
                                }
                            />
                            Enable
                        </label>
                        <input
                            type="datetime-local"
                            className={input}
                            value={(local.time_from ?? nowIsoLocal()).slice(
                                0,
                                16,
                            )}
                            onChange={(e) =>
                                handleChange("time_from", e.target.value)
                            }
                            disabled={!local.time_from_enable}
                        />
                    </div>
                </Field>

                <Field label="Time to">
                    <div className="flex gap-2 items-center">
                        <label className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                            <input
                                type="checkbox"
                                checked={!!local.time_to_enable}
                                onChange={(e) =>
                                    handleChange(
                                        "time_to_enable",
                                        e.target.checked,
                                    )
                                }
                            />
                            Enable
                        </label>
                        <input
                            type="datetime-local"
                            className={input}
                            value={(local.time_to ?? nowIsoLocal()).slice(
                                0,
                                16,
                            )}
                            onChange={(e) =>
                                handleChange("time_to", e.target.value)
                            }
                            disabled={!local.time_to_enable}
                        />
                    </div>
                </Field>

                {/* Optional “extra fields” (useful for context-menu mapping) */}
                <div className="pt-1 border-t border-slate-200 dark:border-slate-800" />
                <Field label="Interface">
                    <input
                        className={input}
                        value={local.interface ?? ""}
                        onChange={(e) =>
                            handleChange("interface", e.target.value)
                        }
                    />
                </Field>
                <Field label="Arbitration ID (hex)">
                    <input
                        className={input}
                        value={local.arbitration_id_hex ?? ""}
                        onChange={(e) =>
                            handleChange("arbitration_id_hex", e.target.value)
                        }
                    />
                </Field>
                <Field label="Data (hex)">
                    <input
                        className={input}
                        value={local.data_hex ?? ""}
                        onChange={(e) =>
                            handleChange("data_hex", e.target.value)
                        }
                    />
                </Field>
            </div>

            <div className="mt-3 flex gap-2">
                <button
                    className="flex-1 rounded-md bg-blue-600 text-white py-1 text-[12px] hover:bg-blue-500 shadow-sm"
                    onClick={apply}
                >
                    Apply
                </button>
                <button
                    className="flex-1 rounded-md bg-blue-600 text-white py-1 text-[12px] hover:bg-blue-500 shadow-sm"
                    onClick={onClear}
                >
                    Clear
                </button>
            </div>
        </div>
    );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
    label,
    children,
}) => (
    <div>
        <div className="text-[12px] mb-1 text-slate-700 dark:text-slate-200">
            {label}
        </div>
        {children}
    </div>
);
