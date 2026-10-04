const Comment = () => {
  return (
    <div
      className="
                      flex gap-3 rounded-xl
                      bg-white p-3
                    "
    >
      <img
        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80"
        alt="Marcus Vance"
        className="
                        h-8 w-8 shrink-0
                        rounded-full object-cover
                        sm:h-9 sm:w-9
                      "
      />

      <div className="min-w-0 flex-1">
        <div
          className="
                          flex items-center
                          justify-between gap-2
                        "
        >
          <h4 className="truncate text-xs font-bold">Marcus Vance</h4>

          <span className="shrink-0 text-[10px] text-gray-400 sm:text-xs">
            45m ago
          </span>
        </div>

        <p
          className="
                          mt-1 text-xs leading-5
                          text-gray-600
                        "
        >
          Looks amazing! Especially loving the spacing and hierarchy on that
          center module. 🙌
        </p>

        <div
          className="
                          mt-2 flex gap-4
                          text-xs text-gray-500
                        "
        >
          <span>♡ 7</span>
          <button>Reply</button>
        </div>
      </div>
    </div>
  );
};

export default Comment;
