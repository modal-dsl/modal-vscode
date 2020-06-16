'use strict';

export const RETURN_PREFIX = {
    SUCCESS: "mdal.command.success",
    ERROR: "mdal.command.error"
};

export const COMMAND = {
    CLEAN: "mdal.clean",
    GENERATE: "mdal.generate"
};

const PROXY_SUFFIX = '.proxy'

export const PROXY_COMMAND = {
    CLEAN: COMMAND.CLEAN + PROXY_SUFFIX,
    GENERATE: COMMAND.GENERATE + PROXY_SUFFIX
};

export type CommandType = (...args: any[]) => any;
