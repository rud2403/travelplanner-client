import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen">
      {/* 사이드 메뉴 */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <h2 className="text-2xl font-bold mb-4">Menu</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/user/signin">
            Sign In
          </Link>
          <Link href="/user/signup">
            Sign Up
          </Link>
          <Link href="#">
            Page 1
          </Link>
          <Link href="#">
            Page 2
          </Link>
          <Link href="#">
            Page 3
          </Link>
        </nav>
      </aside>


      {/* 지도 영역 */}
      <section className="w-full bg-gray-200 p-4">
        <div className="h-full flex items-center justify-center">
          <div className="w-full h-full bg-white border rounded-md shadow-md">
            <p className="text-center p-4 text-gray-600">Map Area</p>
          </div>
        </div>
      </section>
    </main>
  );
}
