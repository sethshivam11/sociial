import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQs() {
  return (
    <div className="w-full px-6 pb-10 sm:pb-20 max-w-5xl flex gap-5 sm:gap-10 flex-col justify-center">
      <h1 className="text-2xl max-sm:text-center sm:text-5xl font-bold">
        Frequently Asked Questions
      </h1>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="hover:no-underline sm:text-xl text-lg">
            What is Sociial?
          </AccordionTrigger>
          <AccordionContent>
            Sociial is an innovative social media platform that connects people,
            fosters creativity, and encourages meaningful interactions. With
            features like personalized stories, custom message themes. Sociial
            offers a fresh, user-friendly experience tailored to your social
            networking needs.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="hover:no-underline sm:text-xl text-lg">
            Is Sociial free to use?
          </AccordionTrigger>
          <AccordionContent>
            Yes, Sociial is completely free to use. All features are available to everyone at no cost. There are no hidden charges or premium plans—just a simple and open social experience for all users.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="hover:no-underline sm:text-xl text-lg">
            What features does Sociial offer?
          </AccordionTrigger>
          <AccordionContent>
            Sociial includes features like Image/Video posts, Stories,
            Audio/Video Calls, Realtime-Notifications, Confessions(Anonymous
            Messages), Dedicated profiles, Personal/Group Chats and much more.
            Our platform is constantly evolving to provide users with the best
            experience possible.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="hover:no-underline sm:text-xl text-lg">
            How is Sociial different from other social media platforms?
          </AccordionTrigger>
          <AccordionContent>
            Sociial stands out with its open-source nature, user-first design,
            customizable features, and a focus on fostering meaningful
            interactions. Plus, we&apos;re committed to transparency and
            community-driven development.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger className="hover:no-underline sm:text-xl text-lg">
            Is my data safe on Sociial?
          </AccordionTrigger>
          <AccordionContent>
            Yes, we take data privacy and security seriously. Sociial uses
            encryption and other advanced technologies to protect your
            information.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
