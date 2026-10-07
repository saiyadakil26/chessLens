"use client";

import Link from "next/link";
import Image from "next/image";
import { Users, ExternalLink, Shield } from "lucide-react";
import { ClubSummary } from "@/lib/chessApi";

export default function ClubCard({
  club,
  memberCount,
  description,
}: {
  club: ClubSummary;
  memberCount?: number;
  description?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:border-accent/40 transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center font-bold text-accent overflow-hidden flex-shrink-0 group-hover:border-accent/50 transition-colors">
            {club.icon ? (
              <Image
                src={club.icon}
                alt={club.name}
                width={56}
                height={56}
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              <Shield className="w-7 h-7 text-accent" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-extrabold text-lg text-foreground group-hover:text-accent transition-colors truncate">
              {club.name}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
              <Users className="w-3.5 h-3.5" />
              <span>
                {memberCount
                  ? `${memberCount.toLocaleString()} members`
                  : "Active Community"}
              </span>
            </div>
          </div>
        </div>

        {description && (
          <p className="text-xs text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
            {description.replace(/<[^>]*>?/gm, "")}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/50">
        <Link
          href={`/clubs/${club.id}`}
          className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
        >
          View Club DNA & Members →
        </Link>

        {club.url && (
          <a
            href={club.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open on Chess.com"
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
