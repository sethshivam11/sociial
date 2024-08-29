export function nameFallback(name: string): string {
  const split = name.toUpperCase().split(" ");
  if (split.length >= 2) {
    return `${split[0].slice(0, 1)}${split[1].slice(0, 1)}`;
  } else {
    return `${split[0].slice(0, 1)}${split[0].slice(1, 2)}`;
  }
}

export function getTimeDifference(createdAt: string) {
  const currentTime = new Date();
  const createdTime = new Date(createdAt);

  const differenceInMs = currentTime.getTime() - createdTime.getTime();
  const differenceInMinutes = Math.floor(differenceInMs / (1000 * 60));

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes}mins ago`;
  }

  const differenceInHours = Math.floor(differenceInMinutes / 60);
  if (differenceInHours < 24) {
    return `${differenceInHours}h ago`;
  }

  const differenceInDays = Math.floor(differenceInHours / 24);
  if (differenceInDays < 7) {
    return `${differenceInDays}days ago`;
  }

  const differenceInWeeks = Math.floor(differenceInDays / 7);
  if (differenceInWeeks < 52) {
    return `${differenceInWeeks}weeks ago`;
  }

  const differenceInYears = Math.floor(differenceInWeeks / 52);
  return `${differenceInYears}years ago`;
}
