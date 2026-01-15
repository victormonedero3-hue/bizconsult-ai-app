
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { Message, Role } from "../types";

const SYSTEM_INSTRUCTION = `Eres BizConsult AI, un consultor de negocios senior y estratega empresarial experto.

TU MISIÓN:
Diagnosticar problemas, optimizar procesos y diseñar estrategias de crecimiento comercial, marketing, ventas, finanzas y operaciones para pymes, autónomos y startups.

REGLA CRÍTICA DE FORMATO (PROHIBIDO EL MARKDOWN):
- NO USES ASTERISCOS (*), ALMOHADILLAS (#), GUIONES (-), NI SÍMBOLOS DE FORMATO MARKDOWN.
- RESPONDE ÚNICAMENTE EN TEXTO PLANO LIMPIO.
- PARA ORGANIZAR LA INFORMACIÓN:
  1. Usa MAYÚSCULAS para los encabezados y secciones importantes.
  2. Usa DOBLE SALTO DE LÍNEA entre párrafos y secciones.
  3. Usa NÚMEROS (1, 2, 3...) para listas y pasos de acción.
- NO uses negritas ni cursivas.

TUS REGLAS DE CONTENIDO:
1. DIAGNÓSTICO PRIMERO: Antes de recomendar, haz preguntas inteligentes sobre el modelo de negocio, sector, facturación, equipo y retos.
2. ACCIONABILIDAD: Da pasos específicos y concretos.
3. TONO: Profesional y analítico.
4. DESCARGO DE RESPONSABILIDAD: Debes incluir siempre: "NOTA: SOY UNA INTELIGENCIA ARTIFICIAL Y NO PROPORCIONO ASESORÍA LEGAL, FISCAL NI FINANCIERA PERSONALIZADA. CONSULTA CON PROFESIONALES."

ESTRUCTURA DE TUS RESPUESTAS (EN TEXTO PLANO):
NOMBRE DE LA SECCIÓN EN MAYÚSCULAS

Contenido detallado aquí sin símbolos extraños.

1. Paso uno
2. Paso dos

KPI CLAVE:
Nombre del indicador.`;

export class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  public async startChat(history: Message[] = []) {
    this.chat = this.ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },
    });
  }

  public async sendMessage(message: string): Promise<string> {
    if (!this.chat) {
      await this.startChat();
    }
    
    try {
      const result = await this.chat!.sendMessage({ message });
      return result.text || "Lo siento, no pude procesar tu solicitud.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  public async *sendMessageStream(message: string) {
    if (!this.chat) {
      await this.startChat();
    }

    try {
      const result = await this.chat!.sendMessageStream({ message });
      for await (const chunk of result) {
        yield (chunk as GenerateContentResponse).text;
      }
    } catch (error) {
      console.error("Gemini API Stream Error:", error);
      throw error;
    }
  }
}

export const bizConsultAI = new GeminiService();
