import Link from "next/link";

const Footer = () => {
  return (
    <div className="px-2 py-4 text-center bg-gray-200">
      <Link href="/about">
        <a className="text-black opacity-80">About the project</a>
      </Link>
    </div>
  );
};

export default Footer;
