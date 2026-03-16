import { NextResponse } from "next/server";
import { QUALIFICATIONS, TGA_SOURCE } from "@/lib/data";

const TGA_BASE = "https://training.gov.au/training/details";
const CACHE_MAX_AGE = 86_400; // 24 hours

interface TgaQualification {
  code: string;
  title: string;
  level: string;
  tgaUrl: string;
  coreUnits: string[];
  electiveUnits: string[];
  totalUnits: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const qual = QUALIFICATIONS.find((q) => q.code === code);
    if (!qual) {
      return NextResponse.json(
        { error: `Qualification ${code} not found` },
        { status: 404 }
      );
    }

    const result: TgaQualification = {
      code: qual.code,
      title: qual.title,
      level: qual.level,
      tgaUrl: `${TGA_BASE}/${qual.code}`,
      coreUnits: qual.coreUnits,
      electiveUnits: qual.electiveUnits,
      totalUnits: qual.units.length,
    };

    return NextResponse.json(
      { data: result, source: TGA_SOURCE },
      {
        headers: {
          "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=3600`,
        },
      }
    );
  }

  const all = QUALIFICATIONS.map((q) => ({
    code: q.code,
    title: q.title,
    level: q.level,
    tgaUrl: `${TGA_BASE}/${q.code}`,
    coreCount: q.coreUnits.length,
    electiveCount: q.electiveUnits.length,
    totalUnits: q.units.length,
  }));

  return NextResponse.json(
    { data: all, source: TGA_SOURCE },
    {
      headers: {
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=3600`,
      },
    }
  );
}
