import { IsNotEmpty } from "class-validator";
import { validateRequest } from "../../../middlewares";
import { StatusCodeEnum } from "../../../enums";

class MockedDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}

const mockReq: any = {
  body: {
    firstName: "Rio",
    lastName: "Test",
  },
};

describe("validateRequest() middleware", () => {
  let mockNext: any, mockRes: any;
  beforeEach(() => {
    jest.resetAllMocks();
    mockNext = jest.fn();
    mockRes = {
      status: jest.fn().mockImplementation((number) => ({
        json: (data) => data,
      })),
    };
  });

  describe("success", () => {
    test("should call next if request request body is valid", () => {
      validateRequest(MockedDto)(mockReq, mockRes, mockNext);
      expect(mockRes.status).toBeCalledTimes(0);
      expect(mockNext).toBeCalledTimes(1);
    });

    test("should call next if request query is valid", () => {
      const mockReqQuery: any = { query: mockReq.body };
      validateRequest(MockedDto)(mockReqQuery, mockRes, mockNext);
      expect(mockRes.status).toBeCalledTimes(0);
      expect(mockNext).toBeCalledTimes(1);
    });
  });

  describe("error", () => {
    test("should throw error", () => {
      const body: any = {};
      const response: any = validateRequest(MockedDto)(body, mockRes, mockNext);
      expect(response.statusCode).toBe(StatusCodeEnum.BAD_REQUEST);
      expect(response).toMatchSnapshot();
      expect(mockRes.status).toBeCalledTimes(1);
      expect(mockNext).toBeCalledTimes(0);
    });
  });
});
