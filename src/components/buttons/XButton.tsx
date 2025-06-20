import Image from "next/image";

type Props = {
  href: string;
};

const XButton = ({ href }: Props) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex justify-center items-center border-2 border-accent text-accent font-bold rounded-full px-2 text-lg min-w-20 max-w-30 min-h-10 hover:opacity-50 transition-all ease-in-out duration-300 cursor-pointer group"
    >
      <div className="relative w-[40px] h-[40px] flex items-center justify-center">
        <Image
          src="/images/icons/x.svg"
          alt="X"
          width={40}
          height={40}
          className="text-accent transition-opacity duration-200 group-hover:opacity-0"
        />
        <span className="absolute inset-0 flex items-center justify-center text-accent text-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          X
        </span>
      </div>
    </a>
  );
};

export default XButton;
