const CommentInput = () => {
  return (
    <div
      className="
                      mt-4 flex items-center gap-2
                      sm:gap-3
                    "
    >
      <img
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
        alt="You"
        className="
                        h-8 w-8 shrink-0
                        rounded-full object-cover
                        sm:h-9 sm:w-9
                      "
      />

      <div
        className="
                        flex min-w-0 flex-1
                        items-center rounded-full
                        bg-white px-3 py-2
                        sm:px-4
                      "
      >
        <input
          type="text"
          placeholder="Write a comment..."
          className="
                          min-w-0 flex-1
                          bg-transparent
                          text-xs outline-none
                          placeholder:text-gray-400
                          sm:text-sm
                        "
        />

        <button
          className="
                          shrink-0 rounded-full
                          bg-[#5052db]
                          px-3 py-1.5
                          text-[10px] font-medium
                          text-white
                          sm:px-4 sm:text-xs
                        "
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
