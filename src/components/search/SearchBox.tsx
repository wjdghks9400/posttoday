interface SearchBoxProps {
    placeholder?: string;
}

export default function SearchBox({
                                      placeholder = "인물, 생일, 사건, 밈, 캐릭터, 날짜 검색",
                                  }: SearchBoxProps) {
    return (
        <form
            action="/search"
            className="rounded-3xl border border-gray-100 bg-white p-3 shadow-sm"
        >
            <div className="flex flex-col gap-3 md:flex-row">
                <input
                    name="q"
                    placeholder={placeholder}
                    className="h-12 flex-1 rounded-2xl bg-gray-50 px-4 text-sm outline-none ring-1 ring-gray-100 focus:bg-white focus:ring-black"
                />

                <select
                    name="category"
                    className="h-12 rounded-2xl bg-gray-50 px-4 text-sm outline-none ring-1 ring-gray-100 focus:bg-white focus:ring-black"
                    defaultValue=""
                >
                    <option value="">전체</option>
                    <option value="BIRTHDAY">생일</option>
                    <option value="HISTORY">사건/역사</option>
                    <option value="MEME">밈</option>
                    <option value="ANNIVERSARY">기념일</option>
                    <option value="FANDOM">팬덤</option>
                    <option value="BRAND">브랜드</option>
                </select>

                <button className="h-12 rounded-2xl bg-black px-6 text-sm font-bold text-white transition hover:bg-gray-800">
                    검색
                </button>
            </div>
        </form>
    );
}