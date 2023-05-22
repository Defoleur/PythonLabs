import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import EventsPage from "../Events/CreatedEventsPage";
import {GetEvents} from "../Events/EventsProvider";
import {
    BrowserRouter as Router,
    Routes,
    Route, BrowserRouter,
} from "react-router-dom";
import {IEvent} from "../models";

const createdEvents : IEvent[] = [{
    id: 2,
    title: "Test event",
    content: "Some event description",
    date: "2023-09-22",
    startTime: "18:00",
    endTime: "19:30",
    user_id: 6,
    username: "admin",
},{
    id: 5,
    title: "Test event filter 2",
    content: "Some test event description",
    date: "2023-09-23",
    startTime: "18:00",
    endTime: "19:30",
    user_id: 6,
    username: "admin",
}
]

const attachedEvents : IEvent[] = [{
    id: 3,
    title: "Test attached event",
    content: "Some attached event description",
    date: "2023-09-25",
    startTime: "18:00",
    endTime: "19:30",
    user_id: 5,
    username: "svash",
},{
    id: 4,
    title: "Test attached filter event 2",
    content: "Some test event description 2",
    date: "2023-09-28",
    startTime: "17:00",
    endTime: "17:30",
    user_id: 3,
    username: "defoleur",
}
]


jest.mock("../Events/EventsProvider")

const mockGetAttachedEvents = jest.mocked(GetEvents)
const mockGetCreatedEvents = jest.mocked(GetEvents)

describe("EventsPage", () => {
    test('should show user attached and created events', async () => {
        mockGetCreatedEvents.mockResolvedValueOnce(createdEvents)
        mockGetAttachedEvents.mockResolvedValueOnce(attachedEvents)
        window.sessionStorage.setItem('username', attachedEvents[0].username)
        render(<EventsPage/>,{wrapper: Router})
        await waitFor(() => {
            const eventItems = screen.getAllByLabelText('event')
            createdEvents.forEach((event, index) => {
                const eventTitle = screen.getByText(event.title)
                expect(eventTitle).toBeInTheDocument()
            })
            attachedEvents.forEach((event, index) => {
                const eventTitle = screen.getByText(event.title)
                expect(eventTitle).toBeInTheDocument()
            })
             expect(eventItems).toHaveLength(4);
        })
    })
    test('should filter events with provided filters when button was clicked', async () => {
         mockGetCreatedEvents.mockResolvedValueOnce(createdEvents)
      mockGetAttachedEvents.mockResolvedValueOnce(attachedEvents)
      render(<EventsPage/>, {wrapper: Router})

      const titleFilterInput = screen.getByLabelText('title-filter') as HTMLInputElement;
        const ownerFilterInput = screen.getByLabelText('owner-filter') as HTMLInputElement;
        const startTimeFilterInput = screen.getByLabelText('start-time-filter') as HTMLInputElement;
        const endTimeFilterInput = screen.getByLabelText('end-time-filter') as HTMLInputElement;
        const startDateFilterInput = screen.getByLabelText('start-date-filter') as HTMLInputElement;
        const endDateFilterInput = screen.getByLabelText('end-date-filter') as HTMLInputElement;

        fireEvent.change(titleFilterInput, {target: {value: 'filter'}});
        fireEvent.change(ownerFilterInput, {target: {value: ''}});
        fireEvent.change(startTimeFilterInput, {target: {value: '10:00'}});
        fireEvent.change(endTimeFilterInput, {target: {value: '20:00'}});
        fireEvent.change(startDateFilterInput, {target: {value: '2023-01-01'}});
        fireEvent.change(endDateFilterInput, {target: {value: '2023-12-31'}});
      const searchButton = screen.getByRole('button', { name: 'Search!' })
      fireEvent.click(searchButton)

      await waitFor(() => {
        const eventItems = screen.getAllByLabelText('event')
        const filteredCreatedEvents = createdEvents.filter(event => event.title.toLowerCase().includes('filter'))
        const filteredAttachedEvents = attachedEvents.filter(event => event.title.toLowerCase().includes('filter'))

        filteredCreatedEvents.forEach(event => {
          const eventTitle = screen.queryByText(event.title)
          expect(eventTitle).toBeInTheDocument()
        })

        filteredAttachedEvents.forEach(event => {
          const eventTitle = screen.queryByText(event.title)
          expect(eventTitle).toBeInTheDocument()
        })
        //expect(eventItems).toHaveLength(filteredCreatedEvents.length + filteredAttachedEvents.length)
      })
    })
    test('should disable created events when created events checkbox is unchecked', async () => {
        mockGetCreatedEvents.mockResolvedValueOnce(createdEvents)
        mockGetAttachedEvents.mockResolvedValueOnce(attachedEvents)
        render(<EventsPage/>, {wrapper: Router})
        fireEvent.click(screen.getByLabelText('my-events-checkbox'));
        await waitFor(() => {
            expect(screen.queryByText("created")).not.toBeInTheDocument()
        })
        fireEvent.click(screen.getByLabelText('my-events-checkbox'));
        fireEvent.click(screen.getByLabelText('attached-events-checkbox'));
        await waitFor(() => {
            expect(screen.queryByText("attached")).not.toBeInTheDocument()
        })

});
// test('should toggle "My events" checkbox and disable "Attached events" checkbox', async () => {
//   mockGetCreatedEvents.mockResolvedValueOnce(createdEvents)
//       mockGetAttachedEvents.mockResolvedValueOnce(attachedEvents)
//       render(<EventsPage/>, {wrapper: Router})
//
//     const myEventsCheckbox = screen.getByLabelText('my-events-checkbox') as HTMLInputElement;
//   const attachedEventsCheckbox = screen.getByLabelText("attached-events-checkbox") as HTMLInputElement;
//
//   expect(myEventsCheckbox).toBeChecked();
//   expect(attachedEventsCheckbox).toBeEnabled();
//
//   fireEvent.click(myEventsCheckbox);
// await waitFor(() => {
//   expect(myEventsCheckbox).not.toBeChecked();
//   expect(attachedEventsCheckbox.disabled).toBe(true);
//   })
//
//   fireEvent.click(myEventsCheckbox);
// await waitFor(() => {
//   expect(myEventsCheckbox).toBeChecked();
//   expect(attachedEventsCheckbox).toBeEnabled();
//   })
// });
//
// test('should toggle "Attached events" checkbox and disable "My events" checkbox', () => {
//   mockGetCreatedEvents.mockResolvedValueOnce(createdEvents)
//       mockGetAttachedEvents.mockResolvedValueOnce(attachedEvents)
//       render(<EventsPage/>, {wrapper: Router})
//
//      const myEventsCheckbox = screen.getByLabelText('my-events-checkbox');
//   const attachedEventsCheckbox = screen.getByLabelText("attached-events-checkbox");
//
//   expect(attachedEventsCheckbox).toBeChecked();
//   expect(myEventsCheckbox).toBeEnabled();
//
//   fireEvent.click(attachedEventsCheckbox);
//
//   expect(attachedEventsCheckbox).not.toBeChecked();
//   expect(myEventsCheckbox).toBeDisabled();
//
//   fireEvent.click(attachedEventsCheckbox);
//
//   expect(attachedEventsCheckbox).toBeChecked();
//   expect(myEventsCheckbox).toBeEnabled();
// });
})
