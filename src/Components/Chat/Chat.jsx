import React from 'react'
import 'tailwindcss/tailwind.css';

function Chat() {
  return (
    <div className='flex flex-col min-h-screen'>
      <h1 className='text-center text-3xl'>Chat App</h1>
      <div className='flex-grow'></div>
      <div className='bg-cyan-400 px-4 py-5 border-2 flex justify-center items-center'>
        <form className='flex'>
          <input type='text' className='border-2 border-slate-800 mr-2' /> 
          <button className='bg-zinc-400 px-5 py-1'>Send</button>
        </form>
      </div>
    </div>
  )
}

export default Chat