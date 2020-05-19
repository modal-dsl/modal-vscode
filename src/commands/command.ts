'use strict';

export const RETURN_PREFIX = {
    SUCCESS: "mdal.command.success",
    ERROR: "mdal.command.error"
};

export type CommandType = (...args: any[]) => any;
