import { HandlerContext } from "$fresh/server.ts";
import {
  V1ResponseBuilder,
  v1Success,
} from "../../../lib/api_v1/responseBuilders.ts";

export const handler = {
  GET(_req: Request, _ctx: HandlerContext) {
    return v1Success(V1ResponseBuilder());
  },
};
