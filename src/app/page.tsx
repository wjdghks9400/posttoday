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
  title: "생일·사건·기념일 기록장",
  description:
      "오늘 생일, 연예인 생일, 아이돌 생일, 사건·사고, 인터넷 대첩, 10주년 기념일 같은 날짜를 모아두는 B급 기록장.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TadayLab - 생일·사건·기념일 기록장",
    description:
        "생일, 사건, 기념일을 모아두는 날짜 기록장.",
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
    title: "오늘 생일인 사람",
    description: "연예인, 아이돌, 인플루언서, 캐릭터 생일을 모아봤음.",
  },
  {
    type: "ANNIVERSARY",
    title: "오늘의 기념일",
    description: "데뷔일, 10주년, 출시일처럼 날짜로 남은 것들.",
  },
  {
    type: "HISTORY",
    title: "오늘 터졌던 사건",
    description: "사건·사고, 역사적 기록, 다시 보면 묘한 날짜들.",
  },
  {
    type: "FANDOM",
    title: "팬덤이 기억하는 날",
    description: "팬들 사이에서 챙기는 생일, 데뷔일, 공개일, 기념일.",
  },
  {
    type: "BRAND",
    title: "브랜드·출시일",
    description: "제품 출시일, 서비스 오픈일, 브랜드가 챙길 만한 날.",
  },
  {
    type: "MEME",
    title: "밈·인터넷 이슈",
    description: "그때 그 난리, 그 드립, 그 인터넷 대첩을 날짜로 기록.",
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
        "생일, 사건, 기념일 모아두는 날짜 기록장.",
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
                  오늘 무슨 날이었지?
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
                  생일, 사건, 기념일 날짜를 모아두는 날짜 기록장.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/calendar" className="btn-primary">
                    날짜별로 보기
                  </Link>

                  <Link href="/search" className="btn-secondary">
                     검색하기
                  </Link>
                </div>
              </div>

              <aside className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
                <h2 className="mb-4 text-sm font-bold text-gray-500">
                  오늘 기록된 것들
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

              <SearchBox placeholder="오늘 무슨 날" />
            </section>
          </Container>
        </section>

        <Container className="py-10 md:py-14">
          <section className="mb-10 grid gap-4 md:grid-cols-4">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">
                전체 기록
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
                제보 대기
              </p>

              <p className="mt-2 text-3xl font-black text-gray-950">
                {stats.pending}
              </p>
            </div>
          </section>

          {todayEvents.length === 0 ? (
              <section className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm">
                <h2 className="text-2xl font-black text-gray-950">
                  오늘 날짜는 아직 조용함
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  오늘 생일, 사건, 기념일, 인터넷 이슈를 알고 있다면
                  직접 제보해줘.
                </p>

                <Link href="/submit" className="btn-primary mt-6">
                  날짜 기록 제보하기
                </Link>
              </section>
          ) : (
              <section className="space-y-6">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-gray-950">
                    오늘의 생일·기념일
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {getTodayLabel()}에 걸려 있는 생일, 기념일, 사건,
                    팬덤 기록, 밈성 날짜들.
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
                  곧 다가오는 날짜들
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  곧 돌아오는 생일, 기념일, 사건 날짜를 미리 봐두자.
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
                최근 추가된 기록
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                새로 등록된 날짜
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
                  Submit
                </p>

                <h2 className="mt-2 text-xl font-black text-gray-950">
                  제보하기
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  생일, 사건 , 기념일 날짜를 제보해주세요
                </p>
              </div>

              <Link href="/submit" className="btn-secondary shrink-0">
                신규 기록 제보하기
              </Link>
            </div>
          </section>
        </Container>
      </main>
  );
}