import { useState } from "react";

// Add type declaration for serial on Navigator
declare global {
  interface Navigator {
    serial?: {
      requestPort: () => Promise<any>;
    };
  }
}

export default function ScannerPage() {
  const [voterId, setVoterId] = useState("");
  const [connected, setConnected] = useState(false);

  const connectScanner = async () => {
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      setConnected(true);

      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();

      console.log("Scanner connected, reading continuously...");

      let buffer = "";

      const readLoop = async () => {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              console.log("Reader done");
              break;
            }

            if (value) {
              buffer += value;
              if (buffer.includes("\n") || buffer.includes("\r")) {
                const fullData = buffer.replace(/[\r\n]+/g, "");
                console.log("Full Scanned Data:", fullData);
                setVoterId(fullData);
                buffer = "";
              }
            }
          }
        } catch (err) {
          console.error("Read loop error:", err);
        } finally {
          reader.releaseLock();
          await port.close();
          setConnected(false);
          console.log("Scanner disconnected");
        }
      };

      readLoop();
    } catch (err) {
      console.error("Scanner connection error:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Scan Voter QR / Barcode</h1>

      <button
        onClick={connectScanner}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={connected}
      >
        {connected ? "Scanner Connected" : "Connect Scanner"}
      </button>

      <p>Latest Scanned Data: {voterId}</p>
    </div>
  );
}
