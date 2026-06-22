import { MapPin, ArrowSquareOut, LinkedinLogo, GithubLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import type { PublicPortfolioData } from "@/pages/portfolio-feed-page";

import defaultProfileImage from "@/assets/image.png";
interface PortfolioFeedCardProps {
  data: PublicPortfolioData;
}

export function PortfolioFeedCard({ data }: PortfolioFeedCardProps) {
  return (
    <div
      className="
      relative
      rounded-3xl
      border border-white/10
      bg-linear-to-br
      from-[#12162f]
      via-[#181c3d]
      to-[#11162d]
      p-6
      flex flex-col h-full
      backdrop-blur-xl
      shadow-lg
      hover:border-[#6c72ff]/40
      hover:shadow-[0_0_30px_rgba(108,114,255,0.15)]
      transition-all duration-300
    "
    >
      <div className="flex justify-center">
        <div className="flex h-60 w-auto">
          <img
            src={data.profile_image || defaultProfileImage}
            alt={data.profile_name || data.portfolio_name || "Perfil"}
            className="h-full w-full object-fit"
          />
        </div>
      </div>

      <div className="mt-5 text-center">
        <h3 className="text-xl font-bold text-white line-clamp-1">{data.profile_name}</h3>
        <p className="text-slate-400 text-sm mt-1 line-clamp-1">{data.profession}</p>
        <div className="pb-4 pt-4 flex items-center gap-1">
          {data.github_username && (
            <div className="flex items-center  text-slate-500">
              <a
                href={`https://github.com/${data.github_username}`}
                className="hover:text-white transition-colors"
              >
                <GithubLogo size={18} weight="fill" />
              </a>
            </div>
          )}
          {data.linkedin_url && (
            <div className="flex items-center  text-slate-500">
              <a href="#" className="hover:text-white transition-colors">
                <LinkedinLogo size={18} weight="fill" />
              </a>
            </div>
          )}
          {data.city && (
            <div className="flex items-center text-slate-500 text-xs">
              <MapPin size={18} weight="fill" />
              <span className="mt-1">{data.city}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4 mb-6 ">
        {data.skills?.slice(0, 4).map((tech, index) => (
          <span key={index}>
            {tech.url_dark && (
              <img src={tech.url_dark} alt={tech.name} className="w-9 h-9 object-contain" />
            )}
          </span>
        ))}
        {data.skills && data.skills.length > 3 && (
          <span className="px-3 py-1 flex  items-center text-slate-400">
            +{data.skills.length - 3}
          </span>
        )}
      </div>

      <div className="grow"></div>

      <a
        href={data.url_portfolio}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full mt-2"
      >
        <Button className="w-full bg-[#1c1f38] hover:bg-[#6c72ff] text-white text-md border border-[#232555] hover:border-[#6c72ff] transition-all flex items-center justify-center gap-2 rounded-xl h-11">
          Visitar portfolio
          <ArrowSquareOut size={16} />
        </Button>
      </a>
    </div>
  );
}
