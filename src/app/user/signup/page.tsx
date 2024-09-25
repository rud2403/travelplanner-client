// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';

// export default function Signup() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [message, setMessage] = useState('');

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     try {
//       const data = await fetchData(); // 여기에 실제 회원가입 API 요청을 넣어야 합니다.
//       setMessage(`Signup successful! Response: ${data}`);
//     } catch (error) {
//       setMessage('Error during signup');
//     }
//   };

//   return (
//     <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
//       <div className="bg-white shadow-lg rounded-lg p-10 max-w-md w-full">
//         <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h1>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//               Name
//             </label>
//             <input
//               id="name"
//               name="name"
//               type="text"
//               required
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
//           >
//             Sign Up
//           </button>
//         </form>
//         <p className="mt-4 text-center text-gray-600">{message}</p>
//         <div className="text-center mt-4">
//           <Link href="/user/signin" className="text-blue-500 hover:underline">
//             Already have an account? Sign In
//           </Link>
//         </div>
//       </div>
//     </main>
//   );
// }
