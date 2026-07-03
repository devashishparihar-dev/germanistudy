import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center justify-center p-8 bg-white dark:bg-black rounded-2xl shadow-xl">
        <Image
          src="/assets/branding/logo_light.png"
          alt="Germani Study Logo"
          width={300}
          height={300}
          priority
          className="block dark:hidden object-contain"
        />
        <Image
          src="/assets/branding/logo_dark.png"
          alt="Germani Study Logo"
          width={300}
          height={300}
          priority
          className="hidden dark:block object-contain"
        />
        <h1 className="mt-8 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Welcome to Germani Study
        </h1>
      </main>
    </div>
  );
}
