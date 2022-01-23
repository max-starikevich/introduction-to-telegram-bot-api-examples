import { lookup as lookupCallback } from "dns";
import { promisify } from "util";

const lookup = promisify(lookupCallback);

export const resolveHostname = async (hostname: string) => {
  try {
    const { address } = await lookup(hostname);
    return address;
  } catch (e) {
    return null;
  }
};
