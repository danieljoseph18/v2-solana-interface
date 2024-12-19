import { NavProps } from "@/components/nav/NavLinkDropdown";

export const headerLinks: NavProps[] = [
  {
    header: { title: "Trade", link: "/trade", redirect: false, subItems: [] },
  },
  {
    header: {
      title: "Earn",
      link: "/earn",
      redirect: false,
      subItems: [],
    },
  },
];

export function splitSentence(sentence: string) {
  const words = sentence.split(" ");

  if (words.length === 0) {
    return {
      firstWord: "",
      remainingWords: "",
    };
  }

  const firstWord = words[0];

  const remainingWords = words.slice(1).join(" ");

  return {
    firstWord,
    remainingWords,
  };
}
