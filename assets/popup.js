"use strict";

document.addEventListener("DOMContentLoaded", () => {
    
    var adpPopup = {};

    (function () {
        
        var $this;

        adpPopup = {
            sPrevious: window.scrollY,
			sDirection: "down",

            /*
			 * Initialize
			 */
			init: function (e) {
                $this = adpPopup;

                $this.popupInit(e);

                // Init events.
				$this.events(e);
            },

            /*
			 * Events
			 */
			events: function (e) {
                // Custom Events
                document.addEventListener("click", (e) => {
                    const target = e.target;
                    if (target.classList.contains(".popup-close") || target.closest(".popup-close")) {
                        $this.closePopup(target);
                    }
                    if (target.classList.contains(".popup-accept") || target.closest(".popup-accept")) {
                        $this.acceptPopup(target);
                        $this.closePopup(target);
                    }
                });

                // Checking this will cause popup to close when user presses key.
                document.addEventListener("keyup", (e) => {
                    // Press ESC to Close.
                    if (e.key === "Escape") {
                        var escCloseItems = document.querySelectorAll('.popup-open[data-esc-close="true"]');
                        if (escCloseItems.length) {
                            escCloseItems.forEach(function(popup, index) {
                                $this.closePopup(popup);
                            });
                        }
                    }

                    // Press F4 to Close.
					if (e.key === "F4") {
                        var f4CloseItems = document.querySelectorAll('.popup-open[data-f4-close="true"]');
                        if (f4CloseItems.length) {
                            f4CloseItems.forEach(function(popup, index) {
                                $this.closePopup(popup);
                            });
                        }
                    }
                });

                // Checking this will cause popup to close when user clicks on overlay.
                document.addEventListener("click", function(e) {
                    if (e.target.classList.contains("popup-overlay")) {
                        var overlayCloseItems = document.querySelectorAll('.popup-open[data-overlay-close="true"]');
                        if (overlayCloseItems.length) {
                            overlayCloseItems.forEach(function(popup, index) {
                                $this.closePopup(popup);
                            });
                        }
                    }
                });
            },

            /*
			 * Init popup elements
			 */
			popupInit: function (e) {
                // Set scroll direction.
                document.addEventListener("scroll", () => {
                    let scrollCurrent = window.scrollY;

                    // Set scroll temporary vars.
					if (scrollCurrent > $this.sPrevious) {
						$this.sDirection = "down";
					} else {
						$this.sDirection = "up";
					}

					$this.sPrevious = scrollCurrent;
                });

                // Open popup
                var popups = document.querySelectorAll(".popup");
                if (popups.length) {
                    popups.forEach(function(popup, index) {
                        // Manual Launch.
                        if ("manual" === popup.dataset.openTrigger) {
                            let selector = popup.dataset.openManualSelector;

                            if (selector) {
                                var popupSelector = document.querySelector(selector);
                                popupSelector.classList.add("popup-trigger");

                                if (popupSelector) {
                                    popupSelector.addEventListener("click", (e) => {
                                        e.preventDefault();
                                        
                                        popup.classList.remove("popup-already-opened");

                                        $this.openPopup(popup);

                                        if (e.currentTarget.classList.contains("popup")) {
                                            $this.closePopup(popupSelector);
                                        }
                                    });
                                }
                            }
                        }

                        // Checks whether a popup should be displayed or not.
                        if (
                            !$this.isAllowPopup(popup) 
                        ) {
                            return;
                        }

                        $this.openTriggerPopup(popup);
                    });
                }
            },

            /*
			 * Checks whether a popup should be displayed or not
			 */
			isAllowPopup: function (e) {
                let popup = e.originalEvent ? this : e;
                
                // Has user seen this popup before?
				let limitDisplay = parseInt(popup.dataset.limitDisplay || 0);

                let limitDisplayCookie = parseInt(
					$this.getCookie("popup-" + popup.dataset.id)
				);
				
                if (
					limitDisplay &&
					limitDisplayCookie &&
					limitDisplayCookie >= limitDisplay
				) {
					return;
				}

				return true;
            },

            /*
			 * Trigger open popup
			 */
			openTriggerPopup: function (e) {
                let popup = e.originalEvent ? this : e;

                var trigger = popup.dataset.openTrigger;
                
                // Time Delay.
				if ("delay" === trigger) {
					setTimeout(function () {
						$this.openPopup(popup);
					}, popup.dataset.openDelayNumber * 1000);
				}

                // Exit Intent.
				if ("exit" === trigger) {
					var showExit = true;
					document.addEventListener("mousemove", function (e) {
						// Get current scroll position
						var scroll =
							window.pageYOffset || document.documentElement.scrollTop;
						if (e.pageY - scroll < 7 && showExit) {
							$this.openPopup(popup);
							showExit = false;
						}
					});
				}
                
                // Scroll Position.
				if ("scroll" === trigger) {
					var pointScrollType = popup.dataset.openScrollType;
					var pointScrollPosition = popup.dataset.openScrollPosition;

					// Event scroll.
                    document.addEventListener("scroll", () => {
						// Type px.
						if ("px" === pointScrollType) {
							if (window.scrollY >= pointScrollPosition) {
								$this.openPopup(popup);
							}
						}

						// Type %.
						if ("%" === pointScrollType) {
							if ($this.getScrollPercent() >= pointScrollPosition) {
								$this.openPopup(popup);
							}
						}
					});
				}
            },

            /*
			 * Trigger close popup
			 */
			closeTriggerPopup: function (e) {
                let popup = e.originalEvent ? this : e;

                var trigger = popup.dataset.closeTrigger;

                // Time Delay.
				if ("delay" === trigger) {
					setTimeout(function () {
						$this.closePopup(popup);
					}, popup.dataset.closeDelayNumber * 1000);
				}

                // Scroll Position.
				if ("scroll" === trigger) {
					var pointScrollType = popup.dataset.closeScrollType;
					var pointScrollPosition = popup.dataset.closeScrollPosition;
					var initScrollPx = popup.dataset.initScrollPx;
					var initScrollPercent = popup.dataset.initScrollPercent;

					// Event scroll.
					document.addEventListener("scroll", () => {
						// Type px.
						if ("px" === pointScrollType) {
							if (
								"up" === $this.sDirection &&
								window.scrollY < initScrollPx - pointScrollPosition
							) {
								$this.closePopup(popup);
							}

							if (
								"down" === $this.sDirection &&
								window.scrollY >= initScrollPx + pointScrollPosition
							) {
								$this.closePopup(popup);
							}
						}

						// Type %.
						if ("%" === pointScrollType) {
							if (
								"up" === $this.sDirection &&
								$this.getScrollPercent() <
									initScrollPercent - pointScrollPosition
							) {
								$this.closePopup(popup);
							}

							if (
								"down" === $this.sDirection &&
								$this.getScrollPercent() >=
									initScrollPercent + pointScrollPosition
							) {
								$this.closePopup(popup);
							}
						}
					});
				}
            },

            /*
			 * Open popup
			 */
			openPopup: function (e) {
                let popup = e.originalEvent ? this : e;
                
                // Hide body scroll.
				if (null !== popup.getAttribute("data-body-scroll-disable") && popup.getAttribute("data-body-scroll-disable") == 'true') {
					document.body.classList.add("popup-scroll-hidden");
				}

                // Set Cookie of Limit display.
				let limit =
                    parseInt($this.getCookie("popup-" + popup.dataset.id) || 0) + 1;
				
                $this.setCookie("popup-" + popup.dataset.id, limit, {
                    expires: popup.dataset.limitLifetime,
                });

                if (popup.classList.contains("popup-open")) {
                    return;
                }

                // Check already opened.
                if (popup.classList.contains("popup-already-opened")) {
                    return;
                }

                // Display popup.
                popup.classList.add("popup-open");
                
                // Set current scroll.
                popup.dataset.initScrollPx = window.scrollY;
                popup.dataset.initScrollPercent = $this.getScrollPercent();
                
                // Open animation.
                let animation = popup.dataset.openAnimation;

                $this.applyAnimation(popup, animation);

                // Init close trigger.
                $this.closeTriggerPopup(popup);
            },

            /*
			 * Close popup
			 */
			closePopup: function (e) {
                let $el = e.originalEvent ? this : e;

                // Get popup container.
				let popup = $el.closest(".popup");

                // Close animation.
				let animation = popup.dataset.exitAnimation;

                $this.applyAnimation(popup, animation, function () {
					// Already opened.
					popup.classList.add("popup-already-opened");

					// Hide popup.
                    popup.classList.remove("popup-open");
					
					// Remove classes from body.
					document.body.classList.remove("popup-scroll-hidden");
				});
            },

            /*
			 * Accept popup
			 */
			acceptPopup: function (e) {
				let $el = e.originalEvent ? this : e;

				// Get popup container.
				let popup = $el.closest(".popup");

				// Set Cookie of Accept.
				$this.setCookie("popup-accept-" + popup.dataset.id, 1, {
					expires: 360,
				});
			},

            /*
			 * Apply animation
			 */
			applyAnimation: function (el, name, callback) {
                var popup = el.closest(".popup");
                
                if (typeof callback === "function") {
					var overlayName = "popupExitFade";
				} else {
					var overlayName = "popupOpenFade";
				}

                // Overlay Animation.
                popup
                    .nextSibling !== null ?
                    popup.nextSibling.classList.add("popup-animated", overlayName) : '';
                    ["webkitAnimationEnd", "mozAnimationEnd","MSAnimationEnd", "oanimationend", "animationend"].forEach((event) => {
                        popup.addEventListener(event, function() {
                            this.classList.remove("popup-animated", overlayName);
                        }, { once: true });
                    });
                
                // Wrap Animation.
                popup
                    .querySelector(".popup-wrap")
                    .classList.add("popup-animated", name);
                    ["webkitAnimationEnd", "mozAnimationEnd","MSAnimationEnd", "oanimationend", "animationend"].forEach((event) => {
                        popup.addEventListener(event, function() {
                            // remove the animation classes after animation ends
                            // required in order to apply new animation on close
                            this.classList.remove("popup-animated", name);

                            if (typeof callback === "function") {
                                callback();
                            }
                        }, { once: true });
                    });
            },

            /*
			 * Set cookie
			 */
			getCookie: function (name) {
				var matches = document.cookie.match(
					new RegExp(
						"(?:^|; )" +
							name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
							"=([^;]*)"
					)
				);
				return matches ? decodeURIComponent(matches[1]) : undefined;
			},

            /*
			 * Set cookie
			 */
			setCookie: function (name, value, options) {
				options = options || {};

				options.path = options.hasOwnProperty("path") ? options.path : "/";

				options.expires = parseInt(options.expires);

				if (typeof options.expires == "number" && options.expires) {
					options.expires = new Date().setDate(
						new Date().getDate() + options.expires
					);

					options.expires = new Date(options.expires).toUTCString();
				}

				value = encodeURIComponent(value);

				var updatedCookie = name + "=" + value;

				for (var propName in options) {
					updatedCookie += "; " + propName;
					var propValue = options[propName];
					if (propValue !== true) {
						updatedCookie += "=" + propValue;
					}
				}

				document.cookie = updatedCookie;
			},

            /*
			 * Get scroll percent
			 */
			getScrollPercent: function () {
                var h = document.documentElement,
					b = document.body,
					st = "scrollTop",
					sh = "scrollHeight";
                return ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
            }
        };

    })();

    // Initialize.
	adpPopup.init();

    document.addEventListener("shopify:section:load", function () {
		adpPopup.init();
	});

	document.addEventListener("shopify:section:unload", function () {
		document.body.classList.remove("popup-scroll-hidden");
	});

});