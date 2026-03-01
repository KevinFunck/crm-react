import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { DateSelectArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";


export default function CalendarPage() {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [newEventTitle, setNewEventTitle] = useState("");

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const title = newEventTitle.trim();
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    if (title) {
      const newEvent = {
        id: String(events.length + 1),
        title,
        start: selectInfo.start,
        end: selectInfo.end,
        allDay: selectInfo.allDay,
      };

      calendarApi.addEvent(newEvent);
      setEvents([...events, newEvent]);
      setNewEventTitle("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-gray-400 text-sm">
            Manage your appointments and meetings
          </p>
        </div>

        {/* Add Event Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter event title..."
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
            />
            <div className="text-gray-400 text-sm flex items-center">
              Select a date on the calendar to create the event
            </div>
          </div>
        </div>

        {/* Calendar Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            initialView="dayGridMonth"
            selectable={true}
            editable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={events}
            select={handleDateSelect}
            height="auto"
            eventColor="#3b82f6"
            eventTextColor="#ffffff"
          />
        </div>
      </div>
    </div>
  );
}