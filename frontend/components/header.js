import { Disclosure } from "@headlessui/react";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Header({ changeUser }) {
    return (
        <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
                <>
                    <div className="mx-8  items-left">
                        <div className="relative w-full flex h-16 items-left justify-between">
                            <div className="flex items-center justify-left">
                                <div className="flex">
                                    <Image
                                        width={60}
                                        height={60}
                                        className="hidden lg:block"
                                        src={require("images/logo.png")}
                                        alt="HackMIT 2022"
                                    />
                                </div>
                            </div>
                            <div className="flex lg:hidden">
                                {/* Mobile menu button */}
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">
                                        Open main menu
                                    </span>
                                    {open ? (
                                        <XMarkIcon
                                            className="block h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <Bars3Icon
                                            className="block h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="hidden flex lg:block">
                                <div className="flex  items-right content-right mt-4">
                                    {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                                    <button
                                        onClick={(e) => {
                                            changeUser;

                                            changeUser(e);
                                            //   console.log(window.localStorage.getItem('user'));

                                            //   console.log("RUNNING");
                                            //   window.localStorage.setItem('user', "anythingelse");
                                            //   console.log(window.localStorage.getItem('user'));
                                            //window.location.href = "/";
                                        }}
                                        // onClick={this.props.changeUser}

                                        className="rounded-md items-right justify-right content-right py-2 text-sm font-medium text-gray-200 hover:bg-gray-700 hover:text-white"
                                    >
                                        Change user
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="lg:hidden">
                        <div className="space-y-1 px-2 pt-2 pb-3">
                            {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                            <Disclosure.Button
                                as="a"
                                onClick={(e) => {
                                    console.log("RUNNING");
                                    window.localStorage.setItem("user", "");
                                    window.location.href = "/heyooo";
                                }}
                                className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                            >
                                Change user
                            </Disclosure.Button>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}
