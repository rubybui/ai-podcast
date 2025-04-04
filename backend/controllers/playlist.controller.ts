import { Request } from "express";
import { StatusCodeEnum } from "../enums";
import { ICustomResponse } from "../middlewares/api-response.middleware";
import { PlaylistModel } from "../models/playlist.model";
import { isValidObjectId } from "mongoose";

export async function listPlaylists(req: Request, res: ICustomResponse) {
  const { user }: { user?: string } = req.query;
  const filters: any = {};

  if (typeof user === "string" && isValidObjectId(user)) {
    filters.user = user;
  }

  const playlists = await PlaylistModel.find(filters).lean();

  return res.success({
    data: playlists,
  });
}

export async function createPlaylist(req: Request, res: ICustomResponse) {
  const { name, user, podcasts } = req.body;

  const playlist = await PlaylistModel.create({ name, user, podcasts });

  return res.success({
    data: playlist,
    statusCode: StatusCodeEnum.CREATED,
  });
}

export async function updatePlaylist(req: Request, res: ICustomResponse) {
  const id = req.params.id;
  const { podcasts } = req.body;

  const updatedPlaylist = await PlaylistModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        podcasts,
      },
    }
  );

  if (!updatedPlaylist) {
    return res.error({
      statusCode: StatusCodeEnum.NOT_FOUND,
    });
  }
  return res.success({
    data: updatedPlaylist,
  });
}
