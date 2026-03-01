import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { DateSelectArg, EventClickArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

interface CustomEvent extends EventInput {
  description?: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  // Format date for datetime-local input
  const formatForInput = (date: Date) =>
    new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

  // Open modal when selecting a slot
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const defaultStart = selectInfo.start;
    const defaultEnd = selectInfo.end || new Date(defaultStart.getTime() + 60 * 60 * 1000);

    // Open modal, but do NOT add event yet
    setTitle("");
    setDescription("");
    setStart(formatForInput(defaultStart));
    setEnd(formatForInput(defaultEnd));
    setIsEditing(false);
    setCurrentEventId(null);
    setIsModalOpen(true);
  };

  // Open modal for editing existing event
  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setCurrentEventId(event.id);
    setTitle(event.title);
    setDescription(event.extendedProps.description || "");
    setStart(formatForInput(event.start!));
    setEnd(formatForInput(event.end!));
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Save event (create or update)
  const handleSave = () => {
    if (!title.trim()) return;
    if (new Date(start) >= new Date(end)) {
      alert("End time must be after start time.");
      return;
    }

    const newEvent: CustomEvent = {
      id: currentEventId || String(Date.now()),
      title,
      description,
      start: new Date(start),
      end: new Date(end),
      allDay: false,
    };

    if (isEditing && currentEventId) {
      setEvents((prev) => prev.map((e) => (e.id === currentEventId ? newEvent : e)));
    } else {
      setEvents((prev) => [...prev, newEvent]);
    }

    closeModal();
  };

  // Delete event
  const handleDelete = () => {
    if (!currentEventId) return;
    setEvents((prev) => prev.filter((e) => e.id !== currentEventId));
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEventId(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Calendar</h1>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            initialView="timeGridWeek"
            selectable
            editable
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            slotDuration="00:30:00"
            height="auto"
          />
        </div>
      </div>

      {/* Modal for creating/editing events */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md space-y-4 border border-gray-800">
            <h2 className="text-xl font-semibold">{isEditing ? "Edit Event" : "Create Event"}</h2>

            <input
              type="text"
              placeholder="Title"
              className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Description"
              className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div>
              <label className="text-sm text-gray-400">Start</label>
              <input
                type="datetime-local"
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">End</label>
              <input
                type="datetime-local"
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>

            <div className="flex justify-between pt-4">
              {isEditing && (
                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 rounded">
                  Delete
                </button>
              )}
              <div className="flex gap-3 ml-auto">
                <button onClick={closeModal} className="px-4 py-2 bg-gray-700 rounded">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 rounded">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}