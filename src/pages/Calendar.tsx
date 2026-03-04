import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { DateSelectArg, EventClickArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

/**
 * Extend FullCalendar's EventInput interface
 * to include a custom description field.
 */
interface CustomEvent extends EventInput {
  description?: string;
}

export default function CalendarPage() {
  /**
   * State to store all calendar events.
   */
  const [events, setEvents] = useState<CustomEvent[]>([]);

  /**
   * Controls modal visibility.
   */
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Determines whether the modal is in edit mode.
   */
  const [isEditing, setIsEditing] = useState(false);

  /**
   * Stores the currently selected event ID (for editing/deleting).
   */
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);

  /**
   * Form state for event fields.
   */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  /**
   * Converts a Date object into a format compatible
   * with <input type="datetime-local" />.
   * Adjusts timezone offset properly.
   */
  const formatForInput = (date: Date) =>
    new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

  /**
   * Triggered when a user selects a time range on the calendar.
   * Pre-fills the modal form with selected start and end times.
   */
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const defaultStart = selectInfo.start;

    // If no end is provided, default to 1 hour after start
    const defaultEnd =
      selectInfo.end || new Date(defaultStart.getTime() + 60 * 60 * 1000);

    // Reset form values
    setTitle("");
    setDescription("");
    setStart(formatForInput(defaultStart));
    setEnd(formatForInput(defaultEnd));

    // Set modal to create mode
    setIsEditing(false);
    setCurrentEventId(null);
    setIsModalOpen(true);
  };

  /**
   * Triggered when an existing event is clicked.
   * Loads event data into the modal for editing.
   */
  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;

    setCurrentEventId(event.id);
    setTitle(event.title);
    setDescription(event.extendedProps.description || "");
    setStart(formatForInput(event.start!));
    setEnd(formatForInput(event.end!));

    // Set modal to edit mode
    setIsEditing(true);
    setIsModalOpen(true);
  };

  /**
   * Handles saving (creating or updating) an event.
   */
  const handleSave = () => {
    // Prevent saving if title is empty
    if (!title.trim()) return;

    // Validate that end time is after start time
    if (new Date(start) >= new Date(end)) {
      alert("End time must be after start time.");
      return;
    }

    // Create event object
    const newEvent: CustomEvent = {
      id: currentEventId || String(Date.now()),
      title,
      description,
      start: new Date(start),
      end: new Date(end),
      allDay: false,
    };

    if (isEditing && currentEventId) {
      // Update existing event
      setEvents((prev) =>
        prev.map((e) => (e.id === currentEventId ? newEvent : e))
      );
    } else {
      // Add new event
      setEvents((prev) => [...prev, newEvent]);
    }

    closeModal();
  };

  /**
   * Deletes the currently selected event.
   */
  const handleDelete = () => {
    if (!currentEventId) return;

    setEvents((prev) =>
      prev.filter((e) => e.id !== currentEventId)
    );

    closeModal();
  };

  /**
   * Closes the modal and resets selected event.
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEventId(null);
  };

  return (
    <>
      <div className="min-h-screen bg-white p-6">
        {/* Page Header */}
        <div className="flex justify-between items-center bg-gray-800 text-white rounded-lg px-6 py-4 shadow mb-6">
          <h2 className="text-2xl font-semibold">Calendar</h2>
        </div>

        {/* Calendar Container */}
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
            initialView="timeGridWeek"
            selectable        // Allows selecting time ranges
            editable          // Allows dragging & resizing events
            events={events}   // Event data source
            select={handleDateSelect}
            eventClick={handleEventClick}
            slotMinTime="06:00:00"   // Calendar visible start time
            slotMaxTime="22:00:00"   // Calendar visible end time
            slotDuration="00:30:00"  // Time slot interval
            height="auto"
          />
        </div>
      </div>

      {/* Modal for creating/editing events */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md space-y-4 border border-gray-800 text-white">
            <h2 className="text-xl font-semibold">
              {isEditing ? "Edit Event" : "Create Event"}
            </h2>

            {/* Title Input */}
            <input
              type="text"
              placeholder="Title"
              className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Description Input */}
            <textarea
              placeholder="Description"
              className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Start Date/Time */}
            <div>
              <label className="text-sm text-gray-400">Start</label>
              <input
                type="datetime-local"
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>

            {/* End Date/Time */}
            <div>
              <label className="text-sm text-gray-400">End</label>
              <input
                type="datetime-local"
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              {/* Show delete button only in edit mode */}
              {isEditing && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 rounded"
                >
                  Delete
                </button>
              )}

              <div className="flex gap-3 ml-auto">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-700 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 rounded"
                >
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