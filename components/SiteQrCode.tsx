import QRCode from "qrcode";
import { SITE_NAME, SITE_WEBSITE_URL } from "@/lib/site";

export async function SiteQrCode({ className = "" }: { className?: string }) {
  const svg = await QRCode.toString(SITE_WEBSITE_URL, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: {
      dark: "#f3f6fb",
      light: "#00000000",
    },
  });

  const host = SITE_WEBSITE_URL.replace(/^https:\/\//, "");

  return (
    <div className={`flex shrink-0 flex-col items-center ${className}`.trim()}>
      <p className="mb-1.5 text-[0.7rem] tracking-[0.04em] text-muted">{host}</p>
      <div
        className="site-qr-frame size-24"
        role="img"
        aria-label={`${SITE_NAME} website QR code`}
      >
        <span
          className="site-qr-frame-well block size-full p-1 [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </div>
  );
}
