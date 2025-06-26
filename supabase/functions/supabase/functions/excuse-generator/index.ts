// This is a serverless function that receives a POST request and returns a random excuse.

import { serve } from "https://deno.land/std/http/server.ts";

const excuses = {
  en: [
    "My dog chewed the charging cable.",
    "Aliens abducted my computer.",
    "I accidentally submitted my grocery list instead.",
    "There was a power outage and my brain went with it.",
    "My younger sibling turned my homework into a paper airplane.",
    "ChatGPT wrote it, but it was too perfect and got flagged.",
    "The WiFi ghost deleted my files again.",
    "I opened my code, and it had mysteriously turned into a love letter.",
    "I finished it, but it’s on my other laptop... the imaginary one.",
    "I was testing time travel and overshot the deadline.",
    "I was updating my code, but GitHub went on strike.",
    "The app crashed right after I pressed 'submit'.",
    "I misunderstood the timezone and submitted yesterday in another country.",
    "My cat walked across the keyboard and introduced 27 bugs.",
    "I outsourced it to my cousin, but he outsourced it to his dog.",
    "The file was too advanced and scared my computer into shutting down.",
    "There was a cosmic ray event and it flipped all my bits.",
    "The file is stuck in a quantum state and can’t be observed.",
    "My hard drive is now a coaster after a coffee spill.",
    "I wrote it all on a napkin, but the wind had other plans."
  ],
  es: [
    "Mi perro mordió el cable del cargador.",
    "Unos alienígenas secuestraron mi computadora.",
    "Accidentalmente entregué mi lista del supermercado.",
    "Hubo un corte de luz y mi cerebro se fue con él.",
    "Mi hermanito convirtió mi tarea en un avión de papel.",
    "Lo escribió ChatGPT, pero era tan perfecto que lo rechazaron.",
    "El fantasma del WiFi borró mis archivos otra vez.",
    "Abrí mi código y misteriosamente se había convertido en una carta de amor.",
    "Lo terminé, pero está en mi otra laptop... la imaginaria.",
    "Estaba probando viajes en el tiempo y pasé la fecha de entrega.",
    "Estaba actualizando mi código, pero GitHub se declaró en huelga.",
    "La app se colgó justo después de apretar 'enviar'.",
    "Confundí la zona horaria y lo entregué ayer, pero en otro país.",
    "Mi gato caminó sobre el teclado y metió 27 bugs.",
    "Se lo pasé a mi primo, pero él se lo pasó a su perro.",
    "El archivo era tan avanzado que mi computadora se apagó por miedo.",
    "Hubo una tormenta cósmica y todos mis bits se invirtieron.",
    "El archivo está en un estado cuántico y no puede ser observado.",
    "Mi disco duro ahora es un posavasos después de un derrame de café.",
    "Escribí todo en una servilleta, pero el viento tenía otros planes."
  ]
};

serve(async (request) => {
  // Set allowed origin
  // check your own origin
  const allowedOrigin = "http://localhost:5173";

  
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",    
    "Access-Control-Allow-Credentials": "true",
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const body = await request.json();
    const language = body?.language || "en";
    const excusesForLanguage = excuses[language] || excuses.en;
    const randomIndex = Math.floor(Math.random() * excusesForLanguage.length);
    const excuse = excusesForLanguage[randomIndex];
    console.log("Excuse generated:", excuse);

    return new Response(JSON.stringify({ excuse }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/excuse-generator' \
    --header 'Authorization: Bearer KEY' \
    --header 'Content-Type: application/json' \
    --data '{"language": "en"}'

*/
