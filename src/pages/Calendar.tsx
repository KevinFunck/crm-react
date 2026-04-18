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

  /* Converts a Date to datetime-local input format */
  const formatForInput = (date: Date) =>
    new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

  /* Opens create modal pre-filled with the selected time range */
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const defaultEnd = selectInfo.end || new Date(selectInfo.start.getTime() + 3600000);
    setTitle(""); setDescription("");
    setStart(formatForInput(selectInfo.start));
    setEnd(formatForInput(defaultEnd));
    setIsEditing(false); setCurrentEventId(null);
    setIsModalOpen(true);
  };

  /* Opens edit modal with clicked event's data */
  const handleEventClick = (clickInfo: EventClickArg) => {
    const ev = clickInfo.event;
    setCurrentEventId(ev.id);
    setTitle(ev.title);
    setDescription(ev.extendedProps.description || "");
    setStart(formatForInput(ev.start!));
    setEnd(formatForInput(ev.end!));
    setIsEditing(true); setIsModalOpen(true);
  };

  /* Creates or updates an event */
  const handleSave = () => {
    if (!title.trim()) return;
    if (new Date(start) >= new Date(end)) {
      alert("End time must be after start time.");
      return;
    }
    const newEvent: CustomEvent = {
      id: currentEventId || String(Date.now()),
      title, description,
      start: new Date(start), end: new Date(end),
      allDay: false,
    };
    if (isEditing && currentEventId) {
      setEvents(prev => prev.map(e => e.id === currentEventId ? newEvent : e));
    } else {
      setEvents(prev => [...prev, newEvent]);
    }
    closeModal();
  };

  const handleDelete = () => {
    if (!currentEventId) return;
    setEvents(prev => prev.filter(e => e.id !== currentEventId));
    closeModal();
  };

  const closeModal = () => { setIsModalOpen(false); setCurrentEventId(null); };

  /* Shared input style */
  const inputCls = "w-full bg-cyber-surface border border-cyber-border rounded px-3 py-2 text-sm text-cyber-text placeholder-cyber-muted/50 focus:outline-none focus:border-cyber-accent/60 focus:ring-1 focus:ring-cyber-accent/30 transition-colors";
  const labelCls = "block text-[10px] font-semibold tracking-widest text-cyber-muted uppercase mb-1.5";

  return (
    <>
      <div className="space-y-5 max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-cyber-card border border-cyber-border rounded-lg px-5 py-3">
          <p className="text-[9px] tracking-widest text-cyber-muted uppercase">Schedule</p>
          <h2 className="text-base font-semibold text-cyber-text mt-0.5">Calendar</h2>
        </div>

        {/* Calendar */}
        <div className="bg-cyber-card border border-cyber-border rounded-lg p-4 overflow-x-auto">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            headerToolbar={{
              left:   "prev,next today",
              center: "title",
              right:  "dayGridMonth,timeGridWeek,listWeek",
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

      {/* Event modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-cyber-card border border-cyber-border rounded-xl w-full max-w-md shadow-glow space-y-4 p-6">

            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-[9px] tracking-widest text-cyber-muted uppercase">Calendar</p>
                <h2 className="text-sm font-semibold text-cyber-text mt-0.5">
                  {isEditing ? "Edit Event" : "New Event"}
                </h2>
              </div>
              <button onClick={closeModal} className="text-cyber-muted hover:text-cyber-text text-lg leading-none">✕</button>
            </div>

            <div>
              <label className={labelCls}>Title</label>
              <input type="text" placeholder="Event title" className={inputCls} value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            <div>
              <label className={labelCls}>Description</label>
              <textarea placeholder="Optional description" className={`${inputCls} resize-none`} rows={2} value={description} onChange={e => setDescription(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Start</label>
                <input type="datetime-local" className={inputCls} value={start} onChange={e => setStart(e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>End</label>
                <input type="datetime-local" className={inputCls} value={end} onChange={e => setEnd(e.target.value)} />
              </div>
            </div>

            <div className="flex justify-between pt-2">
              {isEditing && (
                <button onClick={handleDelete} className="px-4 py-2 text-xs border border-cyber-pink/30 text-cyber-pink rounded hover:bg-cyber-pink/10 transition-colors">
                  Delete
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button onClick={closeModal} className="px-4 py-2 text-xs border border-cyber-border text-cyber-muted rounded hover:text-cyber-text transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-4 py-2 text-xs bg-cyber-accent text-cyber-bg font-bold rounded hover:bg-cyber-accent-dim transition-colors shadow-glow-sm">
                  Save
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
