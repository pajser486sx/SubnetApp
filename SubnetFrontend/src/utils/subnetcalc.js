export function subnetcalc(ipAddress, cidr) {
  const octets = ipAddress.split(".").map(Number);

  if (
    octets.length !== 4 ||
    octets.some(octet => Number.isNaN(octet) || octet < 0 || octet > 255)
  ) {
    throw new Error("Invalid IPv4 address.");
  }

  if (cidr < 0 || cidr > 32) {
    throw new Error("CIDR must be between 0 and 32.");
  }

  const ipNumber =
    ((octets[0] << 24) |
    (octets[1] << 16) |
    (octets[2] << 8) |
    octets[3]) >>> 0;

  const mask = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;

  const network = (ipNumber & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const totalAddresses = 2 ** (32 - cidr);

  const usableHosts = cidr <= 30 ? totalAddresses - 2 : 0;

  const numberToIp = (number) => {
    return [
      (number >>> 24) & 255,
      (number >>> 16) & 255,
      (number >>> 8) & 255,
      number & 255
    ].join(".");
  };

  return {
    subnetMask: numberToIp(mask),
    networkAddress: numberToIp(network),
    broadcastAddress: numberToIp(broadcast),

    firstUsableHost:
      usableHosts > 0 ? numberToIp(network + 1) : "",

    lastUsableHost:
      usableHosts > 0 ? numberToIp(broadcast - 1) : "",

    totalAddresses,
    usableHosts
  };
}