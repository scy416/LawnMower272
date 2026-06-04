import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, useNavigate } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx, jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/@react-router/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let userAgent = request.headers.get("user-agent");
		let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
		let timeoutId = setTimeout(() => abort(), 6e3);
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			[readyOption]() {
				shellRendered = true;
				const body = new PassThrough({ final(callback) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
					callback();
				} });
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				pipe(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
	});
}
//#endregion
//#region app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary,
	Layout: () => Layout,
	default: () => root_default,
	links: () => links
});
var links = () => [
	{
		rel: "preconnect",
		href: "https://fonts.googleapis.com"
	},
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous"
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap"
	}
];
function Layout({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [
			children,
			/* @__PURE__ */ jsx(ScrollRestoration, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
}
var root_default = UNSAFE_withComponentProps(function App() {
	return /* @__PURE__ */ jsx(Outlet, {});
});
var ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary({ error }) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack;
	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
	}
	return /* @__PURE__ */ jsxs("main", {
		className: "pt-16 p-4 container mx-auto",
		children: [
			/* @__PURE__ */ jsx("h1", { children: message }),
			/* @__PURE__ */ jsx("p", { children: details }),
			stack
		]
	});
});
var home_module_default = {
	home: "_home_19b83_17",
	center: "_center_19b83_29",
	badge: "_badge_19b83_40",
	logo: "_logo_19b83_55",
	dot: "_dot_19b83_63",
	tagline: "_tagline_19b83_67",
	actions: "_actions_19b83_75",
	btn: "_btn_19b83_82",
	"btn-primary": "_btn-primary_19b83_96",
	"btn-secondary": "_btn-secondary_19b83_107",
	footer: "_footer_19b83_120"
};
//#endregion
//#region app/Pages/homePage/home.tsx
var home_exports = /* @__PURE__ */ __exportAll({ default: () => home_default });
var home_default = UNSAFE_withComponentProps(function Home() {
	return /* @__PURE__ */ jsx("div", {
		className: home_module_default.home,
		children: /* @__PURE__ */ jsxs("main", {
			className: home_module_default.center,
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: home_module_default.logo,
					children: "SyllaBuddy"
				}),
				/* @__PURE__ */ jsxs("p", {
					className: home_module_default.tagline,
					children: [
						"Plan smarter. Study better. ",
						/* @__PURE__ */ jsx("br", {}),
						"Never miss a deadline again."
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: home_module_default.actions,
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/login",
						className: `${home_module_default.btn} ${home_module_default["btn-primary"]}`,
						children: "Log in"
					}), /* @__PURE__ */ jsx(Link, {
						to: "/signup",
						className: `${home_module_default.btn} ${home_module_default["btn-secondary"]}`,
						children: "Sign up free"
					})]
				})
			]
		})
	});
});
var signUp_module_default = {
	"auth-page": "_auth-page_c7jx0_17",
	"back-link": "_back-link_c7jx0_29",
	"auth-center": "_auth-center_c7jx0_47",
	"auth-card": "_auth-card_c7jx0_55",
	"auth-header": "_auth-header_c7jx0_66",
	badge: "_badge_c7jx0_72",
	"auth-title": "_auth-title_c7jx0_87",
	"auth-sub": "_auth-sub_c7jx0_95",
	"auth-fields": "_auth-fields_c7jx0_101",
	field: "_field_c7jx0_107",
	"field-label": "_field-label_c7jx0_113",
	"field-input": "_field-input_c7jx0_121",
	"auth-error": "_auth-error_c7jx0_141",
	btn: "_btn_c7jx0_150",
	"btn-primary": "_btn-primary_c7jx0_165",
	"btn-full": "_btn-full_c7jx0_181",
	"auth-switch": "_auth-switch_c7jx0_189",
	"auth-link": "_auth-link_c7jx0_195",
	"btn-secondary": "_btn-secondary_c7jx0_206",
	"btn-small": "_btn-small_c7jx0_217"
};
//#endregion
//#region app/Pages/login/login.tsx
var login_exports = /* @__PURE__ */ __exportAll({ default: () => login_default });
var login_default = UNSAFE_withComponentProps(function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	async function handleLogin() {
		setError("");
		setLoading(true);
		try {
			const res = await fetch("http://localhost:8000/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					password
				})
			});
			const data = await res.json();
			if (!res.ok) {
				setError(data.detail || "Login failed");
				return;
			}
			localStorage.setItem("access_token", data.access_token);
			navigate("/timetable");
		} catch {
			setError("Could not connect to server");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ jsx("div", {
		className: signUp_module_default["auth-page"],
		children: /* @__PURE__ */ jsx("main", {
			className: signUp_module_default["auth-center"],
			children: /* @__PURE__ */ jsxs("div", {
				className: signUp_module_default["auth-card"],
				children: [/* @__PURE__ */ jsxs("div", {
					className: signUp_module_default["auth-header"],
					children: [/* @__PURE__ */ jsx("div", {
						className: signUp_module_default.badge,
						children: "welcome back"
					}), /* @__PURE__ */ jsx("h1", {
						className: signUp_module_default["auth-title"],
						children: "Log in"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: signUp_module_default["auth-fields"],
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: signUp_module_default.field,
							children: [/* @__PURE__ */ jsx("label", {
								className: signUp_module_default["field-label"],
								children: "Email"
							}), /* @__PURE__ */ jsx("input", {
								className: signUp_module_default["field-input"],
								type: "email",
								placeholder: "you@example.com",
								value: email,
								onChange: (e) => setEmail(e.target.value)
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: signUp_module_default.field,
							children: [/* @__PURE__ */ jsx("label", {
								className: signUp_module_default["field-label"],
								children: "Password"
							}), /* @__PURE__ */ jsx("input", {
								className: signUp_module_default["field-input"],
								type: "password",
								placeholder: "••••••••",
								value: password,
								onChange: (e) => setPassword(e.target.value)
							})]
						}),
						error && /* @__PURE__ */ jsx("p", {
							className: signUp_module_default["auth-error"],
							children: error
						}),
						/* @__PURE__ */ jsx("button", {
							className: `${signUp_module_default.btn} ${signUp_module_default["btn-primary"]} ${signUp_module_default["btn-full"]}`,
							onClick: handleLogin,
							disabled: loading,
							children: loading ? "Logging in…" : "Log in"
						})
					]
				})]
			})
		})
	});
});
//#endregion
//#region app/Pages/signUp/signUp.tsx
var signUp_exports = /* @__PURE__ */ __exportAll({ default: () => signUp_default });
var signUp_default = UNSAFE_withComponentProps(function Signup() {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	async function handleSignup() {
		setError("");
		setLoading(true);
		try {
			const res = await fetch("http://localhost:8000/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username,
					email,
					password
				})
			});
			const data = await res.json();
			if (!res.ok) {
				setError(data.detail || "Signup failed");
				return;
			}
			navigate("/login");
		} catch {
			setError("Could not connect to server");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ jsx("div", {
		className: signUp_module_default["auth-page"],
		children: /* @__PURE__ */ jsx("main", {
			className: signUp_module_default["auth-center"],
			children: /* @__PURE__ */ jsxs("div", {
				className: signUp_module_default["auth-card"],
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: signUp_module_default["auth-header"],
						children: [
							/* @__PURE__ */ jsx("div", {
								className: signUp_module_default.badge,
								children: "get started"
							}),
							/* @__PURE__ */ jsx("h1", {
								className: signUp_module_default["auth-title"],
								children: "Create account"
							}),
							/* @__PURE__ */ jsx("p", {
								className: signUp_module_default["auth-sub"],
								children: "Plan smarter from day one."
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: signUp_module_default["auth-fields"],
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: signUp_module_default.field,
								children: [/* @__PURE__ */ jsx("label", {
									className: signUp_module_default["field-label"],
									children: "Username"
								}), /* @__PURE__ */ jsx("input", {
									className: signUp_module_default["field-input"],
									type: "text",
									placeholder: "yourname",
									value: username,
									onChange: (e) => setUsername(e.target.value)
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: signUp_module_default.field,
								children: [/* @__PURE__ */ jsx("label", {
									className: signUp_module_default["field-label"],
									children: "Email"
								}), /* @__PURE__ */ jsx("input", {
									className: signUp_module_default["field-input"],
									type: "email",
									placeholder: "you@example.com",
									value: email,
									onChange: (e) => setEmail(e.target.value)
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: signUp_module_default.field,
								children: [/* @__PURE__ */ jsx("label", {
									className: signUp_module_default["field-label"],
									children: "Password"
								}), /* @__PURE__ */ jsx("input", {
									className: signUp_module_default["field-input"],
									type: "password",
									placeholder: "••••••••",
									value: password,
									onChange: (e) => setPassword(e.target.value)
								})]
							}),
							error && /* @__PURE__ */ jsx("p", {
								className: signUp_module_default["auth-error"],
								children: error
							}),
							/* @__PURE__ */ jsx("button", {
								className: `${signUp_module_default.btn} ${signUp_module_default["btn-primary"]} ${signUp_module_default["btn-full"]}`,
								onClick: handleSignup,
								disabled: loading,
								children: loading ? "Creating account…" : "Sign up free"
							})
						]
					}),
					/* @__PURE__ */ jsxs("p", {
						className: signUp_module_default["auth-switch"],
						children: [
							"Already have an account?",
							" ",
							/* @__PURE__ */ jsx(Link, {
								to: "/login",
								className: signUp_module_default["auth-link"],
								children: "Log in"
							})
						]
					})
				]
			})
		})
	});
});
var timetable_module_default = {
	"timetable-page": "_timetable-page_1izkc_3",
	"dashboard-container": "_dashboard-container_1izkc_10",
	topbar: "_topbar_1izkc_16",
	"topbar-title": "_topbar-title_1izkc_23",
	"logout-btn": "_logout-btn_1izkc_34",
	"module-form": "_module-form_1izkc_54",
	"module-input": "_module-input_1izkc_62",
	"btn-add": "_btn-add_1izkc_83",
	summary: "_summary_1izkc_102",
	scard: "_scard_1izkc_109",
	"scard-label": "_scard-label_1izkc_120",
	"scard-val": "_scard-val_1izkc_129",
	"scard-val-red": "_scard-val-red_1izkc_136",
	"scard-sub": "_scard-sub_1izkc_140",
	"grid-wrapper": "_grid-wrapper_1izkc_147",
	grid: "_grid_1izkc_147",
	"col-head": "_col-head_1izkc_162",
	"row-label": "_row-label_1izkc_180",
	"module-name": "_module-name_1izkc_192",
	"remove-mod-btn": "_remove-mod-btn_1izkc_199",
	cell: "_cell_1izkc_220",
	"task-badge": "_task-badge_1izkc_233"
};
//#endregion
//#region app/Pages/timetable/timetable.tsx
var timetable_exports = /* @__PURE__ */ __exportAll({ default: () => timetable_default });
function Timetable() {
	const navigate = useNavigate();
	const [assignments, setAssignments] = useState([]);
	const [moduleInput, setModuleInput] = useState("");
	const handleLogout = () => {
		localStorage.removeItem("access_token");
		navigate("/login");
	};
	const handleRemoveModule = async (moduleCode) => {
		try {
			if ((await fetch(`http://localhost:8000/api/modules/${moduleCode}`, { method: "DELETE" })).ok) setAssignments(assignments.filter((task) => task.module !== moduleCode));
		} catch (error) {
			console.error("Error removing module:", error);
			setAssignments(assignments.filter((task) => task.module !== moduleCode));
		}
	};
	useEffect(() => {
		fetch("http://localhost:8000/api/timetable").then((response) => response.json()).then((data) => setAssignments(data)).catch((error) => console.error("Error fetching data:", error));
	}, []);
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:8000/api/modules", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ module_code: moduleInput })
			});
			if (response.ok) {
				const newModuleAssignments = await response.json();
				setAssignments([...assignments, ...newModuleAssignments]);
				setModuleInput("");
			}
		} catch (error) {
			console.error("Error adding module:", error);
		}
	};
	const uniqueModules = Array.from(new Set(assignments.map((task) => task.module)));
	const weeks = Array.from({ length: 13 }, (_, i) => `W${i + 1}`);
	const numModules = uniqueModules.length;
	const currentWeek = "W0";
	const thisWeekCount = assignments.filter((task) => task.deadline.toUpperCase() === currentWeek.toUpperCase()).length;
	let peakWeek = "N/A";
	let peakCount = 0;
	const weekCounts = {};
	assignments.forEach((task) => {
		const dl = task.deadline.toUpperCase();
		if (!weekCounts[dl]) weekCounts[dl] = 0;
		weekCounts[dl]++;
	});
	for (const [week, count] of Object.entries(weekCounts)) if (count > peakCount) {
		peakCount = count;
		peakWeek = week;
	}
	return /* @__PURE__ */ jsx("div", {
		className: timetable_module_default["timetable-page"],
		children: /* @__PURE__ */ jsxs("div", {
			className: timetable_module_default["dashboard-container"],
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: timetable_module_default.topbar,
					children: [/* @__PURE__ */ jsx("div", {
						className: timetable_module_default["topbar-title"],
						children: "SyllaBuddy"
					}), /* @__PURE__ */ jsx("button", {
						className: timetable_module_default["logout-btn"],
						onClick: handleLogout,
						children: "Sign out"
					})]
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					className: timetable_module_default["module-form"],
					children: [/* @__PURE__ */ jsx("input", {
						type: "text",
						placeholder: "Enter Module Code",
						value: moduleInput,
						onChange: (e) => setModuleInput(e.target.value),
						required: true,
						className: timetable_module_default["module-input"]
					}), /* @__PURE__ */ jsx("button", {
						type: "submit",
						className: timetable_module_default["btn-add"],
						children: "Add Module"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: timetable_module_default.summary,
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: timetable_module_default.scard,
							children: [
								/* @__PURE__ */ jsx("div", {
									className: timetable_module_default["scard-label"],
									children: "This week"
								}),
								/* @__PURE__ */ jsx("div", {
									className: timetable_module_default["scard-val"],
									children: thisWeekCount
								}),
								/* @__PURE__ */ jsx("div", {
									className: timetable_module_default["scard-sub"],
									children: "deadlines"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: timetable_module_default.scard,
							children: [
								/* @__PURE__ */ jsx("div", {
									className: timetable_module_default["scard-label"],
									children: "Peak week"
								}),
								/* @__PURE__ */ jsx("div", {
									className: `${timetable_module_default["scard-val"]} ${timetable_module_default["scard-val-red"]}`,
									children: peakWeek
								}),
								/* @__PURE__ */ jsxs("div", {
									className: timetable_module_default["scard-sub"],
									children: [peakCount, " deadlines"]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: timetable_module_default.scard,
							children: [
								/* @__PURE__ */ jsx("div", {
									className: timetable_module_default["scard-label"],
									children: "Modules"
								}),
								/* @__PURE__ */ jsx("div", {
									className: timetable_module_default["scard-val"],
									children: numModules
								}),
								/* @__PURE__ */ jsx("div", {
									className: timetable_module_default["scard-sub"],
									children: "enrolled"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: timetable_module_default["grid-wrapper"],
					style: { overflowX: "auto" },
					children: /* @__PURE__ */ jsxs("div", {
						className: timetable_module_default.grid,
						style: { minWidth: "850px" },
						children: [
							/* @__PURE__ */ jsx("div", { className: timetable_module_default["col-head"] }),
							weeks.map((week) => /* @__PURE__ */ jsx("div", {
								className: timetable_module_default["col-head"],
								children: week
							}, week)),
							uniqueModules.map((moduleCode) => /* @__PURE__ */ jsxs(React.Fragment, { children: [/* @__PURE__ */ jsxs("div", {
								className: timetable_module_default["row-label"],
								children: [/* @__PURE__ */ jsx("span", {
									className: timetable_module_default["module-name"],
									children: moduleCode
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: timetable_module_default["remove-mod-btn"],
									onClick: () => handleRemoveModule(moduleCode),
									title: `Remove ${moduleCode}`,
									children: "×"
								})]
							}), weeks.map((week) => {
								const tasksInWeek = assignments.filter((task) => task.module === moduleCode && task.deadline.toUpperCase() === week.toUpperCase());
								return /* @__PURE__ */ jsx("div", {
									className: timetable_module_default.cell,
									children: tasksInWeek.map((task) => /* @__PURE__ */ jsx("div", {
										className: timetable_module_default["task-badge"],
										children: task.assignment_name
									}, task.id))
								}, week);
							})] }, moduleCode))
						]
					})
				})
			]
		})
	});
}
var timetable_default = UNSAFE_withComponentProps(Timetable);
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-CYlCPQlR.js",
		"imports": ["/assets/jsx-runtime-DjYOEwHj.js"],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/root-BdhbCgSA.js",
			"imports": ["/assets/jsx-runtime-DjYOEwHj.js"],
			"css": ["/assets/root-DrWFuEvh.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"Pages/homePage/home": {
			"id": "Pages/homePage/home",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/home-Bz2ky9LO.js",
			"imports": ["/assets/jsx-runtime-DjYOEwHj.js"],
			"css": ["/assets/home-BBcFpTDY.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"Pages/login/login": {
			"id": "Pages/login/login",
			"parentId": "root",
			"path": "Login",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/login-E8zfdHsb.js",
			"imports": ["/assets/jsx-runtime-DjYOEwHj.js", "/assets/signUp.module-BczYb3xc.js"],
			"css": ["/assets/signUp-C6HwiTKe.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"Pages/signUp/signUp": {
			"id": "Pages/signUp/signUp",
			"parentId": "root",
			"path": "SignUp",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/signUp-BabfXwbY.js",
			"imports": ["/assets/jsx-runtime-DjYOEwHj.js", "/assets/signUp.module-BczYb3xc.js"],
			"css": ["/assets/signUp-C6HwiTKe.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"Pages/timetable/timetable": {
			"id": "Pages/timetable/timetable",
			"parentId": "root",
			"path": "Timetable",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/timetable-D_TptNhs.js",
			"imports": ["/assets/jsx-runtime-DjYOEwHj.js"],
			"css": ["/assets/timetable-uLhdKjCX.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-f123e745.js",
	"version": "f123e745",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build\\client";
var basename = "/";
var future = {
	"unstable_optimizeDeps": false,
	"v8_passThroughRequests": false,
	"unstable_trailingSlashAwareDataRequests": false,
	"unstable_previewServerPrerendering": false,
	"v8_middleware": false,
	"v8_splitRouteModules": false,
	"v8_viteEnvironmentApi": false
};
var ssr = true;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_node_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"Pages/homePage/home": {
		id: "Pages/homePage/home",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: home_exports
	},
	"Pages/login/login": {
		id: "Pages/login/login",
		parentId: "root",
		path: "Login",
		index: void 0,
		caseSensitive: void 0,
		module: login_exports
	},
	"Pages/signUp/signUp": {
		id: "Pages/signUp/signUp",
		parentId: "root",
		path: "SignUp",
		index: void 0,
		caseSensitive: void 0,
		module: signUp_exports
	},
	"Pages/timetable/timetable": {
		id: "Pages/timetable/timetable",
		parentId: "root",
		path: "Timetable",
		index: void 0,
		caseSensitive: void 0,
		module: timetable_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
