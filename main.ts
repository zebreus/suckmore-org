const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>example-webapp</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      min-height: 100dvh;
      margin: 0;
      display: grid;
      place-content: center;
      text-align: center;
      background: #f8f8f6;
      padding: 2rem;
    }
    em { font-style: normal; color: #3d8c5a; }
    p  { color: #382727; line-height: 1.7; max-width: 36ch; }
  </style>
</head>
<body>
    <h1>Your app is<em>up and running</em></h1>
    <p>Deno is serving this page. Edit <code>main.ts</code> to build something great.</p>
</body>
</html>`;

export default {
  fetch(): Response {
    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
};
