import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../index";
import { authenticateUser, requireEmployer } from "../middleware/auth";

const router = Router();

// All employee routes require employer access
router.use(authenticateUser, requireEmployer);

const createEmployeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  loginCode: z.string().min(1, "Login code is required"),
  position: z.enum(["WAITER", "RUNNER", "HEAD_WAITER"]),
});

// GET /employees - Get all employees
router.get("/", async (_req: Request, res: Response): Promise<void> => {
  const employees = await prisma.user.findMany({
    where: { role: "EMPLOYEE" },
    select: {
      id: true,
      name: true,
      role: true,
      loginCode: true,
      position: true,
    },
  });
  res.json(employees);
});

// POST /employees - Create a new employee
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const parsed = createEmployeeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { name, loginCode, position } = parsed.data;

  const existingEmployee = await prisma.user.findUnique({
    where: { loginCode },
  });

  if (existingEmployee) {
    res.status(409).json({ error: "Login code already in use" });
    return;
  }

  const employee = await prisma.user.create({
    data: {
      name,
      loginCode,
      role: "EMPLOYEE",
      position,
    },
    select: {
      id: true,
      name: true,
      role: true,
      loginCode: true,
      position: true,
    },
  });

  res.status(201).json(employee);
});

// GET /employees/:id - Get a single employee by ID
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;

  const employee = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      role: true,
      loginCode: true,
      position: true,
    },
  });

  if (!employee || employee.role !== "EMPLOYEE") {
    res.status(404).json({ error: "Employee not found" });
    return;
  }

  res.json(employee);
});

export default router;
