import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import EventCard from "@/components/event/EventCard";
import SearchBox from "@/components/search/SearchBox";
import { getHomeDataFromDb } from "@/lib/db/home";
import { getTodayLabel } from "@/lib/date";
import {
  eventTypeEmojiMap,
  eventTypeLabelMap,
} from "@/lib/event-options";
import { CalendarEvent, CalendarEventType } from "@/types/event";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = {
  title: "생일·기념일 검색 캘린더",
  description:
      "TadayLab에서 오늘 생일, 오늘 기념일, 날짜별 생일, 날짜별 기념일, 역사적 사건, K-POP, 게임, 애니, 브랜드 관련 날짜 정보를 검색하세요.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TadayLab - 생일·기념일 검색 캘린더",
    description:
        "오늘 생일, 오늘 기념일, 날짜별 생일과 기념일을 검색할 수 있는 캘린더입니다.",
    url: "/",
    type: "website",
  },
};

const todaySections: {
  type: CalendarEventType;
  title: string;
  description: string;
}[] = [
  {
    type: "BIRTHDAY",
    title: "오늘 생일인 인물",
    description: "오늘 생일인 유명인, 인플루언서, 캐릭터 정보를 확인하세요.",
  },
  {
    type: "ANNIVERSARY",
    title: "오늘의 기념일",
    description: "오늘 날짜에 해당하는 공식 기념일과 의미 있는 날입니다.",
  },
  {
    type: "HISTORY",
    title: "오늘의 역사적 사건",
    description: "오늘 일어난 역사적 사건과 기록을 확인하세요.",
  },
  {
    type: "FANDOM",
    title: "오늘의 팬덤 기념일",
    description: "팬덤에서 챙기기 좋은 데뷔일, 공개일, 관련 기념일입니다.",
  },
  {
    type: "BRAND",
    title: "오늘의 브랜드·출시 기념일",
    description: "브랜드 캠페인, 제품 출시일, 서비스 기념일을 확인하세요.",
  },
  {
    type: "MEME",
    title: "오늘의 밈·인터넷 이슈",
    description: "날짜와 연결해 다시 볼 수 있는 밈과 인터넷 이슈입니다.",
  },
];

function getEventsByType(events: CalendarEvent[], type: CalendarEventType) {
  return events.filter((event) => event.type === type);
}

function getTodayTotalByType(events: CalendarEvent[], type: CalendarEventType) {
  return getEventsByType(events, type).length;
}

function TodaySection({
                        title,
                        description,
                        events,
                      }: {
  title: string;
  description: string;
  events: CalendarEvent[];
}) {
  if (events.length === 0) {
    return null;
  }

  return (
      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-gray-950">
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {description}
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                    {events.length}개
                </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
              <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
  );
}

export default async function HomePage() {
  const { todayEvents, upcomingEvents, recentEvents, stats } =
      await getHomeDataFromDb();

  const visibleTodaySections = todaySections
      .map((section) => ({
        ...section,
        events: getEventsByType(todayEvents, section.type),
      }))
      .filter((section) => section.events.length > 0);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tadaylab.today";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TadayLab",
    url: siteUrl,
    description:
        "날짜별 생일, 기념일, 역사적 사건, K-POP, 게임, 애니, 브랜드 기념일을 검색할 수 있는 캘린더입니다.",
    inLanguage: "ko-KR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
      <main className="min-h-screen bg-gray-50">
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd),
            }}
        />

        <section className="border-b border-gray-100 bg-white">
          <Container className="py-12 md:py-16">
            <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
              <div>
                <p className="mb-4 inline-flex rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-600">
                  {getTodayLabel()}
                </p>

                <h1 className="max-w-4xl text-4xl font-black tracking-tight text-gray-950 md:text-6xl">
                  날짜별로 검색하세요
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
                  TadayLab은 오늘 생일, 오늘 기념일, 날짜별 생일,
                  역사적 사건, K-POP, 게임, 애니, 브랜드 기념일을
                  검색할 수 있는 캘린더입니다.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/calendar" className="btn-primary">
                    날짜별 캘린더 보기
                  </Link>

                  <Link href="/search" className="btn-secondary">
                    생일·기념일 검색하기
                  </Link>
                </div>
              </div>

              <aside className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
                <h2 className="mb-4 text-sm font-bold text-gray-500">
                  오늘 등록된 생일·기념일
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  {todaySections.slice(0, 4).map((section) => (
                      <div
                          key={section.type}
                          className="rounded-2xl bg-white p-4 shadow-sm"
                      >
                        <p className="text-xs font-bold text-gray-500">
                          {eventTypeEmojiMap[section.type]}{" "}
                          {eventTypeLabelMap[section.type]}
                        </p>

                        <p className="mt-2 text-2xl font-black text-gray-950">
                          {getTodayTotalByType(todayEvents, section.type)}
                        </p>
                      </div>
                  ))}
                </div>
              </aside>
            </div>

            <section className="mt-9 max-w-4xl" aria-labelledby="main-search-title">
              <h2 id="main-search-title" className="sr-only">
                생일·기념일 검색
              </h2>

              <SearchBox placeholder="인물, 생일, 기념일, 날짜, K-POP, 게임, 애니 검색" />
            </section>
          </Container>
        </section>

        <Container className="py-10 md:py-14">
          <section className="mb-10 grid gap-4 md:grid-cols-4">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">
                전체 날짜 정보
              </p>

              <p className="mt-2 text-3xl font-black text-gray-950">
                {stats.total}
              </p>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">
                공식 확인
              </p>

              <p className="mt-2 text-3xl font-black text-gray-950">
                {stats.official}
              </p>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">
                커뮤니티 기반
              </p>

              <p className="mt-2 text-3xl font-black text-gray-950">
                {stats.community}
              </p>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">
                검수 대기
              </p>

              <p className="mt-2 text-3xl font-black text-gray-950">
                {stats.pending}
              </p>
            </div>
          </section>

          {todayEvents.length === 0 ? (
              <section className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm">
                <h2 className="text-2xl font-black text-gray-950">
                  아직 오늘 날짜에 등록된 생일·기념일이 없습니다
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  오늘 생일, 오늘 기념일, 역사적 사건, 게임·애니 출시일을
                  알고 있다면 직접 제보해주세요.
                </p>

                <Link href="/submit" className="btn-primary mt-6">
                  날짜 정보 제보하기
                </Link>
              </section>
          ) : (
              <section className="space-y-6">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-gray-950">
                    오늘 생일·기념일
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {getTodayLabel()}에 해당하는 생일, 기념일, 역사적 사건,
                    팬덤·브랜드 관련 날짜 정보입니다.
                  </p>
                </div>

                {visibleTodaySections.map((section) => (
                    <TodaySection
                        key={section.type}
                        title={section.title}
                        description={section.description}
                        events={section.events}
                    />
                ))}
              </section>
          )}

          <section className="mt-14">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-gray-950">
                  다가오는 생일·기념일
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  곧 다가오는 생일, 기념일, 역사적 사건을 미리 확인하세요.
                </p>
              </div>

              <Link
                  href="/calendar"
                  className="hidden text-sm font-bold text-gray-500 hover:text-black md:inline-flex"
              >
                캘린더 보기 →
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>

          <section className="mt-14">
            <div className="mb-6">
              <h2 className="text-3xl font-black tracking-tight text-gray-950">
                최근 추가된 생일·기념일
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                최근 검수되어 등록된 생일, 기념일, 역사적 사건,
                팬덤·브랜드 관련 날짜 정보입니다.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {recentEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>

          <section className="mt-14 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold text-gray-500">
                  Submit Information
                </p>

                <h2 className="mt-2 text-xl font-black text-gray-950">
                  생일·기념일 정보가 빠져 있나요?
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  공개적으로 확인 가능한 생일, 기념일, 출시일, 역사적
                  사건 정보를 제보할 수 있습니다. 제보된 정보는 관리자
                  검수 후 공개됩니다.
                </p>
              </div>

              <Link href="/submit" className="btn-secondary shrink-0">
                신규 항목 제보하기
              </Link>
            </div>
          </section>
        </Container>
      </main>
  );
}