import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-2xl font-bold text-center">
            Welcome
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border p-4 rounded shadow">
              <h2 className="text-lg font-bold">Item 1</h2>
              <p>Description of Item 1</p>
              <p className="text-sm text-gray-500">Price: $10</p>
            </div>
            <div className="border p-4 rounded shadow">
              <h2 className="text-lg font-bold">Item 2</h2>
              <p>Description of Item 2</p>
              <p className="text-sm text-gray-500">Price: $20</p>
            </div>
            <div className="border p-4 rounded shadow">
              <h2 className="text-lg font-bold">Item 3</h2>
              <p>Description of Item 3</p>
              <p className="text-sm text-gray-500">Price: $30</p>
            </div>
          </div>
        </main>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Go to nextjs.org →
          </a>
        </footer>
      </div>
      <Footer />
    </>
  );
}
