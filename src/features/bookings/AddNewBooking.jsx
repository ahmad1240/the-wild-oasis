import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Checkbox from "../../ui/Checkbox";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";

import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useSettings } from "../settings/useSettings";
import { useCabins } from "../cabins/useCabins";
import { differenceInDays, isBefore, isDate, startOfDay } from "date-fns";
import { useCreateBooking } from "./useCreateBooking";
import { useGuests } from "../../hooks/useGuests";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
`;

function AddNewBooking() {
  const [isPaid, setIsPaid] = useState();
  const [wantsBreakFast, setWantsBreakfast] = useState();
  const { settings, isLoading: isLoadingSettings } = useSettings();
  const { cabins, isLoading: isLoadingCabins } = useCabins();
  const { createNewBooking, isLoading: isBookingCreating } = useCreateBooking();
  const { guests, isLoading: isLoadingGuests } = useGuests();

  const navigate = useNavigate();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (isLoadingSettings || isLoadingCabins || isLoadingGuests)
    return <Spinner />;

  function onSubmitForm(data) {
    const numNights = differenceInDays(
      new Date(data.endDate),
      new Date(data.startDate)
    );
    const today = startOfDay;

    // Filter Days

    if (numNights < 1) {
      toast.error("Start date must be before end date");
      return;
    }
    if (numNights < settings.minBookingLength) {
      toast.error(
        `Minimum nights per booking are ${settings.minBookingLength}`
      );
      return;
    }

    if (numNights > settings.maxBookingLength) {
      toast.error(`Maximum night per booking are ${settings.maxBookingLength}`);
      return;
    }
    if (isBefore(new Date(data.startDate), today)) {
      toast.error("You can not book in the past");
      return;
    }

    // Finding Cabin Price

    const reservedCabin = cabins.filter(
      (cabin) => cabin.id === Number(data.cabinId).at(0)
    );
    const cabinPrice =
      (reservedCabin.regularPrice - reservedCabin.discount) * numNights;

    // Extra Price

    const extrasPrice = wantsBreakFast
      ? settings.breakfastPrice * numNights * data.numGuests
      : 0;

    // Total Price

    const totalPrice = cabinPrice + extrasPrice;

    const finalData = {
      ...data,
      totalPrice,
      isPaid,
      extrasPrice,
      numNights: Number(data.numNights),
      cabinId: Number(data.cabinId),
      numGuests: Number(data.numGuests),
      guestId: Number(data.guestId),
      hasBreakfast: wantsBreakFast,
      status: "unconfirmed",
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
    };
    createNewBooking(finalData, {
      onSuccess: () => {
        navigate("/bookings");
      },
    });
  }

  return (
    <Form onSubmit={handleSubmit(onSubmitForm)}>
      <FormRow label="Start Date" error={errors?.startDate?.message}>
        <input
          disabled={isBookingCreating}
          type="date"
          id="startDate"
          {...register("startDate", {
            required: "This Field is Required",
            validate:
              isDate(getValues().startDate) || "You must choose a valid date",
          })}
        />
      </FormRow>
      <FormRow label="End Date" error={errors?.endDate?.message}>
        <input
          disabled={isBookingCreating}
          type="date"
          id="endDate"
          {...register("endDate", {
            required: "This Field is Required",
            validate:
              isDate(getValues().endDate) || "You must choose a valid date",
          })}
        />
      </FormRow>
      <FormRow label="No of Guests" error={errors?.numGuests?.message}>
        <input
          disabled={isBookingCreating}
          type="number"
          id="numGuests"
          min={1}
          defaultValue={1}
          {...register("numGuests", {
            required: "This Field is Required",
            min: {
              value: 1,
              message: "Minimum no of Guests should be 1",
            },
            max: {
              value: settings.maxBookingLength,
              message: `Maximum no of guests must be ${settings.maxBookingLength}`,
            },
          })}
        />
      </FormRow>
      <FormRow label="Select Cabins">
        <StyledSelect
          disabled={isBookingCreating}
          id="cabinId"
          {...register("cabinId")}
        >
          {cabins.map((cabin) => (
            <option key={cabin.id} value={cabin.id}>
              {cabin.name}
            </option>
          ))}
        </StyledSelect>
      </FormRow>
      <FormRow label="Select Guests">
        <StyledSelect
          disabled={isBookingCreating}
          id="guestId"
          {...register("guestId")}
        >
          {guests.map((guest) => (
            <option key={guest.id} value={guest.id}>
              {guest.fullName}
            </option>
          ))}
        </StyledSelect>
      </FormRow>
      <FormRow label="Further Observation">
        <input
          disabled={isBookingCreating}
          type="text"
          id="observation"
          {...register("observations")}
        />
      </FormRow>
      <FormRow>
        <Checkbox
          disabled={isBookingCreating}
          id="breakfast"
          onChange={(e) => setWantsBreakfast(!e)}
        >
          I want breakfast with my Booking
        </Checkbox>
      </FormRow>
      <FormRow>
        <Checkbox id="paid" onChange={(e) => setIsPaid(!e)}>
          This booking is Paid
        </Checkbox>
      </FormRow>
      <FormRow>
        <Button type="submit" variation="primary" disabled={isBookingCreating}>
          Submit
        </Button>
        <Button
          type="cancel"
          variation="secondary"
          disabled={isBookingCreating}
        >
          Cancel
        </Button>
      </FormRow>
    </Form>
  );
}

export default AddNewBooking;
