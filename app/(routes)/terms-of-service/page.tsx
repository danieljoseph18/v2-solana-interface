"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button, Link } from "@nextui-org/react";
import { BsChevronUp } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const sections = [
    { id: "use-of-site", title: "1. Use of the Site and the Interface" },
    { id: "fees", title: "2. Fees" },
    { id: "no-advice", title: "3. No Professional Advice or Fiduciary Duties" },
    { id: "proprietary-rights", title: "4. Proprietary Rights" },
    {
      id: "modification",
      title: "5. Modification, Suspension, and Termination",
    },
    { id: "risks", title: "6. Risks" },
    { id: "prohibited-uses", title: "7. Prohibited Uses" },
    { id: "disclosures", title: "8. Disclosures; Disclaimers" },
    { id: "limitation-of-liability", title: "9. Limitation of Liability" },
    { id: "indemnification", title: "10. Indemnification" },
    { id: "dispute-resolution", title: "11. Dispute Resolution & Arbitration" },
    { id: "governing-law", title: "12. Governing Law" },
    { id: "general-information", title: "13. General Information" },
    { id: "contact-information", title: "Contact Information" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollPosition = contentRef.current.scrollTop;
        setShowBackToTop(scrollPosition > 200);

        const sectionElements = contentRef.current.querySelectorAll("h2[id]");
        sectionElements.forEach((section) => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.id);
          }
        });
      }
    };

    const scrollArea = contentRef.current;
    if (scrollArea) {
      scrollArea.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollArea) {
        scrollArea.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement && contentRef.current) {
      const yOffset = -20; // Adjust this value as needed
      const y = sectionElement.offsetTop + yOffset;

      contentRef.current.scrollTo({ top: y, behavior: "smooth" });

      // For mobile, we also need to close the sidebar if it&apos;s open
      const sidebar = document.querySelector(".md\\:w-1\\/4");
      if (sidebar && window.innerWidth < 768) {
        sidebar.classList.add("hidden");
      }
    }
  };

  // Add a function to toggle the sidebar on mobile
  const toggleSidebar = () => {
    const sidebar = document.querySelector(".md\\:w-1\\/4");
    if (sidebar) {
      sidebar.classList.toggle("hidden");
    }
  };

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-card-grad text-foreground">
      <button
        className="md:hidden fixed top-20 right-4 z-50 p-2 bg-accent text-accent-foreground rounded bg-input-grad border-printer-orange border-2"
        onClick={toggleSidebar}
      >
        <FaSearch className="text-printer-orange" />
      </button>

      <div className="w-full md:w-1/4 p-4 border-r border-border md:overflow-y-auto hidden md:block">
        <h1 className="text-2xl font-bold mb-4 pt-6">Table of Contents</h1>
        <nav>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    activeSection === section.id
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }`}
                  onClick={() => scrollToSection(section.id)}
                >
                  {section.title}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div
        className="w-full md:w-3/4 h-screen overflow-y-auto p-6 space-y-6 bg-card-grad"
        ref={contentRef}
      >
        <h1 className="text-3xl font-bold mb-4">
          PRINT3R Terms and Conditions
        </h1>
        <p className="text-sm text-muted-foreground">
          Last modified: August 1st, 2022
        </p>

        <section>
          <p>
            Welcome to PRINT3R.xyz (&quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;), the informational resource for PRINT3R Protocol,
            as defined below.
          </p>
          <p>
            PRINT3R.xyz provides information and resources about the
            fundamentals of the decentralized non-custodial protocol called the
            PRINT3R Protocol (the &quot;PRINT3R Protocol,&quot;
            &quot;Protocol,&quot; or &quot;PRINT3R DApp&quot;). PRINT3R.xyz is
            not an available access point to the PRINT3R Protocol.
          </p>
          <p>
            These Terms and Conditions and any other documents incorporated
            herein by reference (collectively, these &quot;Terms&quot;) to you
            or the company or other legal entity you represent (&quot;you&quot;
            or &quot;your&quot;) explains the terms and conditions by which you
            may access PRINT3R.xyz (&quot;the Site&quot;) and app.PRINT3R.xyz
            (&quot;the Interface&quot;). Please do not use the Site or Interface
            if you disagree with any of these Terms.
          </p>
        </section>

        <section id="use-of-site">
          <h2 className="text-2xl font-semibold mb-4">
            1. Use of the Site and the Interface
          </h2>
          <p>The PRINT3R.xyz site is for informational purposes only.</p>
          <p>
            PRINT3R.xyz is not part of any transaction on the blockchain
            networks underlying the PRINT3R Protocol; we do not have possession,
            custody, or control over any crypto assets appearing on the
            Interface; and we do not have possession, custody, or control over
            any user&apos;s funds. Further, we do not store, send, or receive
            any crypto assets. You understand that when you interact with any
            PRINT3R Protocol smart contracts, you always retain control over
            your crypto assets. We do not have access to your private keys.
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2">
            1.1. Conditions for accessing or using the Site or Interface:
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              If you are an individual person, then you are of legal age in the
              jurisdiction in which you reside, and you have the legal capacity
              to enter into these Terms and be bound by them;
            </li>
            <li>
              If you are an entity, then you must have the legal authority to
              accept these Terms on that entity&apos;s behalf, in which case
              &quot;you&quot; (except as used in this paragraph) will mean that
              entity;
            </li>
            <li>You are not a U.S. Person;</li>
            <li>
              You are not a resident, national, or agent of any country to which
              the United States, the United Kingdom, or the European Union
              embargoes goods or imposes similar sanctions (collectively,
              &quot;Restricted Territories&quot;);
            </li>
            <li>
              You are not subject to economic or trade sanctions administered or
              enforced by any governmental authority; or otherwise, you are not
              a member of any sanctions list or equivalent maintained by the
              United States government, the United Kingdom government, the
              European Union, or the United Nations, including without
              limitation the U.S. Office of Foreign Asset Control Specifically
              Designated Nationals and Blocked Person List (collectively,
              &quot;Sanctions Lists Persons&quot;);
            </li>
            <li>
              You do intend to transact with any Restricted Person or Sanctions
              List Person;
            </li>
            <li>
              You do not, and will not, use VPN software or any other privacy or
              anonymization tools or techniques, or other means, to circumvent,
              or attempt to circumvent, any restrictions that apply; and
            </li>
            <li>
              Your access is not prohibited by and does not otherwise violate or
              assist you in violating any domestic or foreign law, rule,
              statute, regulation, by-law, order, protocol, code, decree,
              letter, or another directive, requirement, guidance, or guideline,
              published or in force that applies to or is otherwise intended to
              govern or regulate any person, property, transaction, activity,
              event or other matter, including any rule, letter, order,
              judgment, directive or other requirements, guidance, or guideline
              issued by any domestic or foreign federal, provincial or state,
              municipal, local or other governmental, regulatory, judicial or
              administrative authority having jurisdiction over PRINT3R.xyz or
              you as otherwise duly enacted, enforceable by law, the common law
              or equity (collectively, &quot;Applicable Laws&quot;); or
              contribute to or facilitate any illegal activity.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">
            1.2. Acknowledgements and agreements:
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              The Site or the Interface may be inaccessible or inoperable for
              various reasons;
            </li>
            <li>
              We reserve the right to disable or modify access to the Site at
              any time;
            </li>
            <li>The Interface may evolve or be modified by third parties;</li>
            <li>
              Pricing information on the Site or Interface is not an offer or
              solicitation;
            </li>
            <li>PRINT3R.xyz does not act as a broker or advisor for you;</li>
            <li>
              You are solely responsible for your use of the Site or Interface;
            </li>
            <li>We owe no fiduciary duties or liabilities to you;</li>
            <li>
              You are solely responsible for reporting and paying applicable
              taxes;
            </li>
            <li>
              We have no control over, or liability for, transactions with third
              parties.
            </li>
          </ul>
        </section>

        <section id="fees">
          <h2 className="text-2xl font-semibold mb-4">2. Fees</h2>
          <p>
            You are required to pay all fees for transactions involving certain
            blockchain networks. These fees may include gas costs and all other
            fees reflected on the Interface at your use, including
            trading-related fees. PRINT3R.xyz does not receive fees for any
            blockchain transactions or using the Site or the Interface.
          </p>
        </section>

        <section id="no-advice">
          <h2 className="text-2xl font-semibold mb-4">
            3. No Professional Advice or Fiduciary Duties
          </h2>
          <p>
            Nothing herein constitutes legal, financial, business, or tax
            advice, and you are strongly advised to consult an advisor(s) before
            engaging in any activity in connection herewith. All information
            provided by the Site is for informational purposes only and should
            not be construed as professional advice. You should not take, or
            refrain from taking, any action based on any information contained
            on the Site or any other information that we make available at any
            time, including, without limitation, blog posts, articles, links to
            third-party content, discord content, news feeds, tutorials, tweets,
            and videos. The Terms are not intended to, and do not, create or
            impose any fiduciary duties on us.
          </p>
        </section>

        <section id="proprietary-rights">
          <h2 className="text-2xl font-semibold mb-4">4. Proprietary Rights</h2>
          <p>
            4.1. PRINT3R.xyz own all rights, names, logos, and other marks used
            on the Site and the Interface, including, without limitation, any
            copyrights in and to any content, code, data, or other materials
            that you may access or use on or through the Site or the Interface;
            however, the code for the PRINT3R Protocol and the Interface
            (app.PRINT3R.xyz) deployed on IPFS is open-sourced. Except as
            expressly set forth herein, your use of or access to the Site or the
            Interface does not grant you any ownership or other rights therein.
          </p>
          <p>
            4.2. PRINT3R.xyz may use and share your comments, bug reports,
            ideas, or other feedback that you may provide, including suggestions
            about how we might improve. You agree that PRINT3R.xyz is free to
            use or not use any feedback we receive from you as we see fit,
            including copying and sharing such feedback with third parties,
            without any obligation to you.
          </p>
        </section>

        <section id="modification">
          <h2 className="text-2xl text-left font-semibold mb-4">
            5. Modification, Suspension, and Termination
          </h2>
          <p>
            5.1. PRINT3R.xyz reserve the right, at our sole discretion, from
            time to time and with or without prior notice to you, to modify,
            suspend or disable (temporarily or permanently) the Site or our
            subdomain to the Interface, in whole or in part, for any reason
            whatsoever, including, without limitation. Upon termination of your
            access, your right to use the Site or the Interface from our
            subdomain will immediately cease. However, it would still be
            accessible via a third party since we do not host or own its code.
            PRINT3R.xyz will not be liable for any losses suffered by you
            resulting from any modification to the Site or the Interface or from
            any modification, suspension, or termination, for any reason, of
            your access to all or any portion of the Site or the Interface.
          </p>
          <p>
            5.2. PRINT3R.xyz may revise these Terms from time to time. We will
            notify you by updating the date at the top of the Terms and
            maintaining a current version. The most current version of the Terms
            will always be at https://PRINT3R.xyz/#/terms-and-conditions. All
            modifications will be effective when they are posted. By continuing
            to access or use the Site or the Interface after those revisions
            become effective, you agree to be bound by the revised Terms.
          </p>
        </section>

        <section id="risks">
          <h2 className="text-2xl font-semibold mb-4">6. Risks</h2>
          <p>
            6.1. The use of technology related to blockchain, smart contracts,
            and cryptocurrencies, among others, entails a risk that by accessing
            transactions, you are assuming. PRINT3R.xyz does not own or control
            any underlying software through which blockchain networks are
            formed. The software underlying blockchain networks are open-source
            so anyone can use, copy, modify, and distribute it. By using the
            Interface, you acknowledge and agree:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              That PRINT3R.xyz is not responsible for the operation of the
              open-source software and networks underlying the Interface;
            </li>
            <li>
              That there exists no guarantee of the functionality, security, or
              availability of that software and networks; and
            </li>
            <li>
              That the underlying networks are subject to sudden changes in
              operating rules, such as those commonly referred to as
              &quot;forks,&quot; which may materially affect the Interface. You
              are responsible for securing your private key(s). We do not have
              access to your private key(s); losing control of your private
              key(s) will permanently and irreversibly deny you access to any
              blockchain-based network. Neither PRINT3R.xyz nor any other person
              or entity will be able to retrieve or protect your digital assets.
              If your private key(s) are lost, you will not be able to transfer
              your digital assets to any blockchain address or wallet. If this
              occurs, you will not be able to realize any value or utility from
              the digital assets you may hold.
            </li>
          </ul>
          <p>
            6.2. PRINT3R.xyz is not responsible for the content of any third
            party, including, but not limited to, information, materials,
            products, or services that PRINT3R.xyz does not own or control. In
            addition, third parties may offer promotions related to your access
            and use of the Interface. PRINT3R.xyz does not endorse or assume any
            responsibility for such resources or promotions. Suppose you access
            any such resources or participate in any such promotions. In that
            case, you do so at your own risk and understand that these Terms do
            not apply to your dealings or relationships with any third parties.
            You expressly relieve PRINT3R.xyz of all liability arising from
            using such resources or participating in such promotions.
          </p>
          <p>
            6.3. You understand that the Arbitrum and Avalanche blockchain
            remain under development, which creates technological and security
            risks when using the Interface, in addition to uncertainty relating
            to digital assets and transactions therein. You acknowledge that the
            cost of transacting on the Arbitrum and Avalanche blockchain is
            variable and may increase at any time, causing an impact on any
            activities taking place on these blockchains, which may result in
            price fluctuations or increased costs when using the Interface.
          </p>
          <p>
            6.4. Transactions entered into in connection with the Interface are
            irreversible and final, and there are no refunds. You acknowledge
            and agree that you will access and use the Interface at your own
            risk.
          </p>
          <p>
            6.5. We must comply with Applicable Law, which may require us to,
            upon request by government agencies, take certain actions or provide
            information that may not be in your best interests.
          </p>
          <p>
            6.6. You hereby assume and agree that PRINT3R.xyz will have no
            responsibility or liability for the risks in Section 9. You hereby
            irrevocably waive, release and discharge all claims, whether known
            or unknown to you, against PRINT3R.xyz, its affiliates, and their
            respective shareholders, members, directors, officers, employees,
            agents, representatives, suppliers, and contractors related to any
            of the risks set forth in this Section 6.
          </p>
        </section>

        <section id="prohibited-uses">
          <h2 className="text-2xl font-semibold mb-4">7. Prohibited Uses</h2>
          <p>
            7.1 You agree not to engage in the prohibited uses set forth below.
            The specific activities set forth below are representative but not
            exhaustive. By using the Site or the Interface, you confirm that you
            will not do any of the following:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Promote or facilitate illegal activities, including but not
              limited to money laundering, terrorist financing, tax evasion,
              buying or selling illegal drugs, contraband, counterfeit goods, or
              illegal weapons;
            </li>
            <li>
              Engage in transactions involving items that infringe or violate
              any copyright, trademark, right of publicity, privacy, or any
              other proprietary right of PRINT3R.xyz;
            </li>
            <li>Engage in improper or abusive trading practices;</li>
            <li>
              Upload or transmit viruses, worms, Trojan horses, time bombs,
              cancelbots, spiders, malware, or any other type of malicious code;
            </li>
            <li>
              Use the Site or Interface in any way that is libelous, defamatory,
              profane, obscene, pornographic, sexually explicit, indecent, lewd,
              vulgar, suggestive, harassing, stalking, hateful, threatening,
              offensive, discriminatory, bigoted, abusive, inflammatory,
              fraudulent, deceptive, or otherwise objectionable;
            </li>
            <li>
              Harass, abuse, or harm another person or entity, including
              PRINT3R.xyz&apos;s collaborator and service providers;
            </li>
            <li>
              Impersonate another user of the Site or the Interface or otherwise
              misrepresent yourself;
            </li>
            <li>
              Engage or attempt to engage or encourage, induce or assist any
              third party, or yourself attempt, to engage in any of the
              activities prohibited under this Section 4 or any other provision
              of these Terms.
            </li>
          </ul>
        </section>

        <section id="disclosures">
          <h2 className="text-2xl font-semibold mb-4">
            8. Disclosures; Disclaimers
          </h2>
          <p>
            PRINT3R.xyz is an informational site for the PRINT3R Protocol.
            PRINT3R.xyz does not operate an exchange platform or offer trade
            execution or clearing services and has no oversight, involvement, or
            control concerning your transactions using the Interface. All
            transactions between users of the Interface are executed
            peer-to-peer directly between the users&apos; blockchain addresses
            through a third-party developed open-source smart contract.
          </p>
          <p>
            You are responsible for complying with all Applicable Laws that
            govern your Perpetual Contracts. As a result of restrictions under
            the Commodity Exchange Act and the regulations promulgated
            thereunder by the U.S. Commodity Futures Trading Commission
            (&quot;CFTC&quot;), no U.S. Person may enter into Perpetual
            Contracts using the Interface.
          </p>
          <p>
            You understand that PRINT3R.xyz is not registered or licensed by any
            regulatory agency or authority. No such agency or authority has
            reviewed or approved the use of the Site or the Interface.
          </p>
          <p>
            You agree that the Site and the Interface are provided on an
            &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. PRINT3R.xyz
            makes no guarantees of any kind or connection with the Site or the
            Interface.
          </p>
        </section>

        <section id="limitation-of-liability">
          <h2 className="text-2xl font-semibold mb-4">
            9. Limitation of Liability
          </h2>
          <p>
            In no event shall PRINT3R.xyz, its affiliates, its suppliers and
            contractors, and its affiliates&apos;, suppliers&apos; and
            contractors&apos; respective stockholders, members, directors,
            officers, managers, employees, attorneys, agents, representatives,
            suppliers, and contractors shall be liable for any direct, indirect,
            incidental, special, punitive, consequential or similar damages or
            liabilities whatsoever (including, without limitation, damages for
            loss of fiat, assets, data, information, revenue, opportunities,
            use, goodwill, profits or other business or financial benefit)
            arising out of or in connection with the Site or the Interface, or
            other item provided by or on behalf of PRINT3R.xyz, whether under
            contract, tort (including negligence), civil liability, statute,
            strict liability, breach of warranties, or under any other theory of
            liability, and whether or not we have been advised of, knew of or
            should have known of the possibility of such damages and
            notwithstanding any failure of the essential purpose of these Terms
            or any limited remedy hereunder nor is PRINT3R.xyz in any way
            responsible for the execution or settlement of transactions between
            users of the Interface.
          </p>
          <p>
            In no event shall PRINT3R.xyz&apos;s aggregate liability arising out
            of or in connection with the Site or Interface exceed one thousand
            United Arab Emirates Dirhams (1,000.00 AED).
          </p>
        </section>

        <section id="indemnification">
          <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
          <p>
            You will defend, indemnify, and hold harmless PRINT3R.xyz, its
            affiliates, members, member, managers, employees, attorneys,
            representatives, suppliers, and contractors from any claim, demand,
            lawsuit, action, proceeding, investigation, liability, damage, loss,
            cost or expense, including without limitation reasonable
            attorneys&apos; fees, arising out of or relating to (a) your use of
            or conduct in connection with the Site or the Interface (b) your
            violation of these Terms; or (c) your misuse of the Site or the
            Interface, or any smart contract and/or script related thereto; (d)
            your violation of any laws, rules, regulations, codes, statutes,
            ordinances, or orders of any governmental or quasi-governmental
            authorities; (e) your violation of the rights of any third party,
            including any intellectual property right, publicity,
            confidentiality, property, or privacy right; (f) your use of a
            third-party product, service, and/or website; or (g) any
            misrepresentation made by you. We reserve the right to assume, at
            your expense, the exclusive defense, and control of any matter
            subject to indemnification by you. You agree to cooperate with our
            defense of any claim. You will not, in any event, settle any claim
            without.
          </p>
        </section>

        <section id="dispute-resolution">
          <h2 className="text-2xl font-semibold mb-4">
            11. Dispute Resolution & Arbitration
          </h2>
          <p>
            PRINT3R.xyz will use its best efforts to resolve potential disputes
            through informal, good faith negotiations. If a potential dispute
            arises, you must contact us by sending a written notice of your
            claim (&quot;Notice&quot;) to PRINT3R.xyz on any of our official
            channels. The notice must (a) describe the nature and basis of the
            claim and (b) set forth the specific relief sought. Our notice to
            you will be similar in form to that described above. If you and
            PRINT3R.xyz cannot reach an agreement to resolve the claim within
            sixty (60) days of your email, then you and PRINT3R.xyz agree to
            resolve the potential dispute according to the process set forth
            below.
          </p>
          <p>
            Any claim or controversy arising out of or relating to the Site, the
            Interface, or these Terms, or any other acts or omissions for which
            you may contend that we are liable, including (but not limited to)
            any claim or controversy as to arbitrability (&quot;Dispute&quot;),
            shall be finally and exclusively settled by arbitration under the
            Corte Civil y Mercantil de Arbitraje (CIMA). You understand that you
            are required to resolve all Disputes by binding arbitration. The
            arbitration shall be confidential before a single arbitrator, who
            shall be selected pursuant to the CIMA rules. The arbitration will
            be held in Madrid, Spain, unless you and we both agree to hold it
            elsewhere. Unless we agree otherwise, the arbitrator may not
            consolidate your claims with those of any other party. Any judgment
            on the award rendered by the arbitrator may be entered in any court
            of competent jurisdiction.
          </p>
          <p>
            Any claim arising out of or related to these Terms or the Site or
            the Interface must be filed within one year after such claim arose;
            otherwise, the claim is permanently barred, which means that you and
            PRINT3R.xyz will not have the right to assert the claim.
          </p>
        </section>

        <section id="governing-law">
          <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
          <p>
            The interpretation and enforcement of these Terms, and any dispute
            related to these Terms, the Site, or the Interface, will be governed
            by and construed and enforced under the laws of the Bahamas, as
            applicable.
          </p>
        </section>

        <section id="general-information">
          <h2 className="text-2xl font-semibold mb-4">
            13. General Information
          </h2>
          <p>
            13.1. Any right or remedy of PRINT3R.xyz set forth in these Terms is
            in addition to, and not in lieu of, any other right or remedy
            whether described in these Terms, under Applicable Law, at law, or
            in equity. The failure or delay of PRINT3R.xyz in exercising any
            right, power, or privilege under these Terms shall not operate as a
            waiver thereof.
          </p>
          <p>
            13.2. The following sections of these Terms will survive any
            termination of your access to the Site or the Interface, regardless
            of the reasons for its expiration or termination, in addition to any
            other provision which by law or by its nature should survive:
            Sections 3 through 12.
          </p>
          <p>
            13.3. The invalidity or unenforceability of any of these Terms shall
            not affect the validity or enforceability of any other of these
            Terms, all of which shall remain in full force and effect.
          </p>
          <p>
            13.4. PRINT3R.xyz will have no responsibility or liability for any
            failure or delay in performance of the Site or the Interface, or any
            loss or damage that you may incur, due to any circumstance or event
            beyond our control, including without limitation any flood,
            extraordinary weather conditions, earthquake, or other act of God,
            fire, war, insurrection, riot, labor dispute, accident, any law,
            order regulation, direction, action or request of the government,
            communications, power failure, or equipment or software malfunction.
          </p>
          <p>
            13.5. You may not assign or transfer any right to use the Site, the
            Interface, or any of your rights or obligations under these Terms,
            without our express prior written consent, including by operation of
            law or in connection with any change of control. We may assign or
            transfer any or all of our rights or obligations under these Terms,
            in whole or part, without notice or obtaining your consent or
            approval.
          </p>
          <p>
            13.6. These Terms contain the entire agreement between you and
            PRINT3R.xyz and supersede all prior and contemporaneous
            understandings between the parties regarding the Interface and the
            Site or the Interface.
          </p>
          <p>
            13.7. In the event of any conflict between these Terms and any other
            agreement you may have with us, these Terms will control unless the
            other agreement specifically identifies these Terms and declares
            that the other agreement supersedes these Terms.
          </p>
          <p>
            13.8. You agree that, except as otherwise expressly provided in
            these Terms, there shall be no third-party beneficiaries to the
            Terms other than the Indemnified Parties.
          </p>
        </section>

        <section id="contact-information">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p>
            If you have any questions about these Terms, the Site, or the
            Interface, please get in touch with PRINT3R.xyz on any of our
            official channels.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <Link
                href="https://x.com/PRINT3R"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </Link>
            </li>
            <li>
              <Link
                href="https://t.me/print3rXYZ"
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram
              </Link>
            </li>
          </ul>
        </section>

        <footer className="mt-8 pt-8 border-t border-border">
          <ul className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <li>
              <a href="#" className="hover:underline">
                Terms and Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Referral Terms
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Media Kit
              </a>
            </li>
          </ul>
        </footer>
      </div>
      {showBackToTop && (
        <Button
          className="fixed bottom-4 right-4 rounded-full p-2"
          onPress={scrollToTop}
          aria-label="Back to top"
        >
          <BsChevronUp className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default TermsAndConditions;
