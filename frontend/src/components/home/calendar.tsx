"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@/src/components/home/calendar.css";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { EventType } from "@/src/lib/definitions";

export default function Calendar() {
  const { data: userSession } = useSession();
  const [events, setEvents] = useState<EventType[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const userEmail = userSession?.user?.email;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 769);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!userEmail) {
        console.warn("User email is not available. Skipping fetch.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3002/api/tasks?userEmail=${encodeURIComponent(
            userEmail
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const tasks = await response.json();

        const mappedEvents = tasks.flatMap(
          (task: { title: any; createdAt: any; id: any; dueDate: any }) => [
            {
              id: `${task.id} (start)` ,
              title: task.title,
              start: task.createdAt,
              editable: false,
              allDay: true,
              backgroundColor: "#4CAF50", // green for start date
              borderColor: "#4CAF50",
              url: `http://localhost:3000/home/tasks/${task.id}`,
            },
            {
              id: task.id,
              title: `${task.title} (Due)`,
              start: task.dueDate || undefined,
              allDay: true,
              backgroundColor: "#F44336", // red for due date
              borderColor: "#F44336",
              url: `http://localhost:3000/home/tasks/${task.id}`,
            },
          ]
        );

        const todayEvent = {
          title: "Today",
          allDay: true,
          start: new Date(),
          editable: false,
          textColor: "var(--foreground)",
        };

        setEvents([todayEvent, ...mappedEvents]);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [userEmail]);

  const handleEventDrop = async (info: { revert?: any; event?: any }) => {
    const { event } = info;
    try {
      const response = await fetch(
        `http://localhost:3002/api/tasks/${event.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dueDate: event.start,
            userEmail: userEmail, // Update with new start date
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task date");
      }
    } catch (error) {
      console.error("Error updating task date:", error);
      info.revert(); // Revert the event's position if the update fails
    }
  };

  return (
    <div className="calendar-container w-full">
      <FullCalendar
        height={isMobile ? "800px" : "auto"}
        themeSystem="standard"
        views={{
          dayGridMonth: {
            titleFormat: {
              year: "numeric",
              month: isMobile ? "short" : "long",
            },
            buttonText: "Month View",
          },
        }}
        plugins={[dayGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "",
          center: "title",
          right: "prev,next today",
        }}
        buttonText={{
          today: "Current Date",
          month: "Month",
        }}
        initialView="dayGridMonth"
        nowIndicator={true}
        editable={true}
        selectable={true}
        selectMirror={true}
        events={events}
        eventDrop={handleEventDrop}
      />
    </div>
  );
}
