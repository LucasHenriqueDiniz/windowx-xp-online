import Window from "@/components/Window/Window";
import { WindowPropertiesProps } from "@/types/window-properties";
import Image from 'next/image';

export default function Pinball(props: WindowPropertiesProps) {
  return (
    <Window {...props}>
      <div
        className="w-full h-full bg-black flex items-center justify-center"
        style={{ cursor: "none" }} // O jogo original esconde o cursor
      >
        <Image
          src="/assets/pinball/table.bmp"
          alt="3D Pinball - Space Cadet"
          layout="fill"
          objectFit="contain"
        />
      </div>
    </Window>
  );
}
