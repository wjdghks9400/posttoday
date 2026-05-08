import Link from "next/link";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/common/SectionTitle";
import EventList from "@/components/event/EventList";
import EventCard from "@/components/event/EventCard";
import SearchBox from "@/components/search/SearchBox";
import AdPlaceholder from "@/components/common/AdPlaceholder";
import { getHomeDataFromDb } from "@/lib/db/home";
import { getTodayLabel } from "@/lib/date";

export default async function HomePage() {
  const { todayEvents, featuredEvents, weeklyEvents, stats } =
      await getHomeDataFromDb();

  return (
      <main className="min-h-screen bg-gray-50">
        <section className="border-b border-gray-100 bg-white">
          <Container className="py-14 md:py-20">
            <div className="max-w-4xl">
              <p className="mb-4 inline-flex rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
                {getTodayLabel()} 콘텐츠 소재
              </p>

              <h1 className="text-4xl font-black tracking-tight text-gray-950 md:text-6xl">
                오늘 뭐 올리지?
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
                생일, 기념일, 밈, 팬덤 이벤트를 한눈에 모아보고 오늘 올릴
                콘텐츠 소재를 빠르게 찾아보세요.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                    href="/calendar"
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-gray-950 px-6 text-sm font-bold text-white transition hover:bg-gray-800"
                >
                  캘린더 보기
                </Link>

                <Link
                    href="/submit"
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 text-sm font-bold text-gray-800 transition hover:bg-gray-50"
                >
                  소재 제보하기
                </Link>
              </div>

              <div className="mt-8 max-w-3xl">
                <SearchBox />
              </div>
            </div>
          </Container>
        </section>

        <Container className="py-10 md:py-14">
          <section>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">등록 소재</p>
                <p className="mt-2 text-3xl font-black text-gray-950">
                  {stats.total}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">공식 확인</p>
                <p className="mt-2 text-3xl font-black text-gray-950">
                  {stats.official}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">커뮤니티 기반</p>
                <p className="mt-2 text-3xl font-black text-gray-950">
                  {stats.community}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">승인 대기</p>
                <p className="mt-2 text-3xl font-black text-gray-950">
                  {stats.pending}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-14">
            <SectionTitle
                title="오늘 써먹기 좋은 소재"
                description="오늘 날짜에 맞춰 바로 활용하기 좋은 콘텐츠 소재입니다."
            />

            <EventList events={todayEvents} />

            <div className="mt-10">
              <AdPlaceholder label="오늘 소재 하단 광고 영역" size="wide" />
            </div>
          </section>

          <section className="mt-14">
            <SectionTitle
                title="요즘 보기 좋은 대표 소재"
                description="최근 등록된 소재 중 콘텐츠로 확장하기 좋은 항목입니다."
            />

            <div className="grid gap-5 md:grid-cols-3">
              {featuredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>

          <section className="mt-14">
            <SectionTitle
                title="이번 주 참고할 소재"
                description="이번 주 콘텐츠 캘린더를 미리 준비해보세요."
            />

            <EventList events={weeklyEvents} />
          </section>
        </Container>
      </main>
  );
}