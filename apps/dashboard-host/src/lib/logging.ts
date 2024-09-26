type LoggingConfig = {
  level: "info" | "error";
  name?: string;
};

// common that noisier levels are lower value
const levelByName = { info: 1, error: 5 };

const createLogFn = (opts: LoggingConfig, level: LoggingConfig["level"]) => {
  const loggerLevelNum = levelByName[opts.level];
  const requestedLevelNum = levelByName[level]!;
  const method = level === "error" ? console.error : console.log;
  return (input: any) => {
    if (requestedLevelNum < loggerLevelNum) return;
    method(
      JSON.stringify({
        level,
        time: new Date().toISOString(),
        ...(opts.name ? { name: opts.name } : {}),
        ...(input instanceof Error
          ? { error: input.stack ?? String(input) }
          : { message: input }),
      }),
    );
  };
};

export const createLogger = (opts?: LoggingConfig) => {
  const config = { ...opts, level: opts?.level || "info" };
  return {
    error: createLogFn(config, "error"),
    log: createLogFn(config, "info"),
  };
};

export type Logger = ReturnType<typeof createLogger>;
