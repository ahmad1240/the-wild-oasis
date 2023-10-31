import AddNewBooking from "../features/bookings/AddNewBooking";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function NewBooking() {
  return (
    <>
      <Row type="horizontal"></Row>
      <Heading as="h1">New Booking</Heading>
      <AddNewBooking />
    </>
  );
}

export default NewBooking;
