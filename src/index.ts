import { Elysia } from "elysia";
import { availableHoursController } from "./controllers/appointments/available-hours-controller";

export const app = new Elysia({
  prefix: "/api",
});

app.use(availableHoursController);

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
