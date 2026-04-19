// Rehost and simplify the Studierendenwerk Darmstadt menu page
import { DOMParser } from "jsr:@b-fuze/deno-dom";

const originalUrl = new URL("https://suckless.org");

const myOriginBasedOnRequest = (requestedUrl: URL) => {
  if (requestedUrl.hostname.endsWith("localhost")) {
    const myUrl = new URL("http://localhost");
    myUrl.port = requestedUrl.port;
    return myUrl;
  }
  // ipv4
  if (requestedUrl.hostname.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
    const myUrl = new URL(requestedUrl.origin);
    return myUrl;
  }
  // ipv6
  if (requestedUrl.hostname.includes(":")) {
    const myUrl = new URL(requestedUrl.origin);
    return myUrl;
  }
  // strip subdomains
  const myUrl = new URL(requestedUrl.origin);
  const domainParts = myUrl.hostname.split(".");
  if (domainParts.length > 2) {
    myUrl.hostname = domainParts.slice(-2).join(".");
  }
  return myUrl;
};

const redirect = () => {
  console.error("Redirecting to original page");
  return new Response(originalUrl.origin, {
    headers: {
      location: originalUrl.origin,
    },
    status: 307,
  });
};

// Process HTML files
const processHTML = (input: string, requestedUrl: URL) => {
  let textData = input;
  textData = textData
    .replaceAll(
      '<span id="headerSubtitle">software that sucks less</span>',
      '<marquee id="headerSubtitle" style="width: auto"><span>software that sucks less</span></marquee>',
    )
    .replaceAll(originalUrl.origin, myOriginBasedOnRequest(requestedUrl).origin)
    .replaceAll(originalUrl.host, myOriginBasedOnRequest(requestedUrl).host)
    .replaceAll("suckless", "suckmore")
    .replaceAll("gcc", "Java EE 7")
    .replace(/([^a-zA-Z0-9])C(99)?([^a-zA-Z0-9])/g, "$1Java 7$3")
    .replaceAll("source-code repositories", "dropbox folders")
    .replaceAll("source-code repository", "dropbox folder")
    .replaceAll("git repositories", "dropbox folders")
    .replaceAll("git repository", "dropbox folder")
    .replaceAll("git repos", "dropbox folders")
    .replaceAll("git repo", "dropbox folder")
    .replaceAll("git", "dropbox")
    .replaceAll("code quality", "veganism")
    .replaceAll("quality software", "paid software")
    .replaceAll("simplicity, clarity, and frugality", "simplisticness")
    .replaceAll("simplicity, clarity and frugality", "simplisticness")
    .replaceAll("simple", "simplistic")
    .replaceAll("minimal", "bare")
    .replaceAll("usable", "unusable")
    .replaceAll("the opposite", "exactly this")
    .replaceAll("Unfortunately", "Fortunately")
    .replaceAll("his/her", "it/its")
    .replaceAll("POSIX", "Microsoft POSIX subsystem")
    .replaceAll("München", "Silicon Valley")
    .replaceAll("Germany", "California")
    .replaceAll("Würzburg", "Cupertino")
    .replaceAll("Linux", "WSL")
    .replaceAll("binary", "WASM blob")
    .replaceAll("BSD", "MacOS™")
    .replaceAll("switch", "hub")
    .replaceAll("wiki page", "Discord channel")
    .replaceAll(" wiki ", " Discord ")
    .replaceAll("programmer", "vibe-coder")
    .replaceAll("hacker", "vibe-coder")
    .replaceAll("computer", "thin client")
    .replaceAll("EUR", "BTC")
    .replaceAll("USD", "DOGE")
    .replaceAll("community", "corporation")
    .replaceAll("vulnerabilities", "CTF challenges")
    .replaceAll("complexity", "simplicity")
    .replaceAll("developer", "agent")
    .replaceAll(" development", " agentic development")
    .replaceAll("IRC", "Telegram")
    .replaceAll(" hacking", " vibing")
    .replaceAll("This is simply a delusion", "We share that sentiment")
    .replaceAll("bare hardware", "cloud servers")

    .replace(/mailing[\W\n]*list/gi, "discord server");

  //.replace(/(?<=<p>[^<]*?)m(?=[^<]*?<\/p>)/g, "meow")

  textData = switchWords(textData, "tab", "space");
  textData = switchWords(textData, "individuals", "corporate entities");
  textData = switchWords(textData, " less", " more");
  textData = switchWords(textData, "most", "least");
  textData = switchWords(textData, "consistency", "inconsistency");
  textData = switchWords(textData, "independant", "dependant");
  textData = switchWords(textData, "open source", "proprietary");
  textData = switchWords(textData, "patch", "pull request");
  textData = switchWords(textData, "static linking", "dynamic linking");
  textData = switchWords(textData, "X11", "Wayland");
  textData = switchWords(textData, "Improvements", "Replacements");

  //const dom = new DOMParser().parseFromString(textData, "text/html");
  //const processed = dom.querySelector("html")?.outerHTML;

  return textData;
};

// Process SVG files
const processSVG = (input: string, _requestedUrl: URL) => {
  let textData = input;
  textData = textData
    .replaceAll("#1177aa", "rgb(204, 13, 125)")
    .replaceAll("#17a", "rgb(204, 13, 125)")
    .replaceAll("#1177AA", "rgb(204, 13, 125)")
    .replaceAll("#069", "rgb(185, 7, 111)")
    .replaceAll("#006699", "rgb(185, 7, 111)")
    .replaceAll("#56c8ff", "rgb(255, 30, 161)")
    .replaceAll("suckless", "suckmore");
  return textData;
};

// Process CSS files
const processCSS = (input: string, requestedUrl: URL) => {
  let textData = input;
  textData = textData
    .replaceAll("#17a", "rgb(204, 13, 125)")
    .replaceAll("#069", "rgb(185, 7, 111)")
    .replaceAll("#56c8ff", "rgb(255, 30, 161)");

  textData += `
#menu { transform: rotate(-0.4deg); }
p {
  animation: slide-in 25s linear infinite;
  transform-origin: center;}

@media (prefers-reduced-motion: reduce) {
p {
  /* lets reduce the motion */
  animation: slide-in 120s linear infinite;
  }
}

@keyframes slide-in {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(0.7deg);
  }
  50% {
    transform: rotate(0deg);
  }
  75% {
    transform: rotate(-0.7deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

        `;

  const dom = new DOMParser().parseFromString(textData, "text/html");

  const processed = dom.querySelector("html")?.outerHTML;

  return textData;
};

const switchWords = (text: string, a: string, b: string) => {
  return text
    .replaceAll(a, "TEMP_PLACEHOLDER")
    .replaceAll(b, a)
    .replaceAll("TEMP_PLACEHOLDER", b);
};

const getUpstreamUrl = (requestedUrl: URL) => {
  const myUrl = myOriginBasedOnRequest(requestedUrl);
  const myDomainParts = myUrl.hostname.split(".");
  const requestedDomainParts = requestedUrl.hostname.split(".");
  const subDomainToUse =
    requestedDomainParts.length != myDomainParts.length
      ? [requestedDomainParts[0]]
      : [];

  const otherUrl = new URL(requestedUrl);
  otherUrl.hostname = [
    ...subDomainToUse,
    ...originalUrl.hostname.split("."),
  ].join(".");
  otherUrl.port = originalUrl.port;
  otherUrl.protocol = originalUrl.protocol;
  return otherUrl;
};

export default {
  fetch: async (req) => {
    try {
      const requestedUrl = new URL(req.url);
      const fullDomainToParse = getUpstreamUrl(requestedUrl);

      console.log({ fullDomainToParse });
      const textResponse = await fetch(fullDomainToParse.href);

      let processed;
      const fileType = fullDomainToParse.pathname.split(".").pop();

      if (
        fileType == "png" ||
        fileType == "ico" ||
        fileType == "webm" ||
        fileType == "jpg"
      ) {
        processed = await textResponse.blob();
        console.log("didnt process " + fileType);
      } else if (fileType == "svg") {
        processed = processSVG(await textResponse.text(), requestedUrl);
        console.log("processed svg");
      } else if (fileType == "css") {
        processed = processCSS(await textResponse.text(), requestedUrl);
        console.log("processed css");
      } else {
        processed = processHTML(await textResponse.text(), requestedUrl);
        console.log("processed html");
      }

      return new Response(processed, {
        headers: {
          "access-control-allow-origin": "*",
          "content-type":
            textResponse.headers.get("content-type") ??
            "text/html; charset=utf-8",

          //for production
          "cache-control": "public, max-age=600",

          //for debugging
          //"cache-control": "no-cache, no-store, must-revalidate",
          pragma: "no-cache",
          expires: "0",
        },
        status: 200,
      });
    } catch (e) {
      console.error(e);
      return redirect();
    }
  },
} satisfies Deno.ServeDefaultExport;
