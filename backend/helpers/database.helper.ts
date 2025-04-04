export const postFindHelper = (result) => {
  if (result) {
    if (Array.isArray(result)) {
      result.forEach((doc) => {
        delete doc.__v;
      });
    } else {
      delete result.__v;
    }
  }
  return result;
};

export const postSaveHelper = (doc: Document, next: any) => {
  delete (doc as any)._doc.__v;
  next();
};
